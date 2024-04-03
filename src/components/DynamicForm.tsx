import React, { useState, ChangeEvent, useEffect, useCallback } from "react";
import { InputSchema } from "../../types";
import { usePredictionContext } from "@/coontext/prediction";
import FileUpload from "./FilesUpload";
import { FileWithPath } from "react-dropzone";

type FormData = {
  [key: string]: string | number | boolean;
};

type DynamicFormProps = {
  schema: InputSchema;
  version: string;
  image: string;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const DynamicForm: React.FC<DynamicFormProps> = ({
  schema,
  version,
  image,
}) => {
  const initialFormData = Object.fromEntries(
    Object.entries(schema).map(([key, field]) => [
      key,
      field.default !== undefined ? field.default : "",
    ])
  );
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: string }>(
    {}
  );
  const [resetKey, setResetKey] = useState(0);

  const { setGlobalPredictions } = usePredictionContext();

  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    key: string
  ) => {
    let value: string | number = event.target.value;

    value = parseInt(value, 10);
    setFormData({ ...formData, [key]: value });
  };

  const handleBooleanInputChange = (
    event: ChangeEvent<HTMLSelectElement>,
    key: string
  ) => {
    const value = event.target.value === "true"; // Convert string "true" or "false" to boolean
    setFormData({ ...formData, [key]: value });
  };

  // const handleFileChange = (
  //   event: ChangeEvent<HTMLInputElement>,
  //   key: string
  // ) => {
  //   if (event.target.files && event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const base64String = reader.result as string;
  //       // Update formData with the Base64 encoded string for the image
  //       setFormData({ ...formData, [key]: base64String });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleDrop = useCallback(
    (acceptedFiles: FileWithPath[], inputKey: string) => {
      acceptedFiles.forEach((file) => {
        console.log(`Uploaded file name: ${file.name}`);
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result as string;
          console.log(base64String);

          setFormData((prevFormData) => ({
            ...prevFormData,
            [inputKey]: base64String,
          }));

          setSelectedFiles((prevSelectedFiles) => ({
            ...prevSelectedFiles,
            [inputKey]: file.name,
          }));
        };

        console.log(file.name);

        reader.readAsDataURL(file);
      });
      console.log("hello");
    },
    []
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const inputData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => {
        if (typeof value === "boolean") {
          return [key, value];
        }

        const valueStr = typeof value === "number" ? value.toString() : value;

        return [key, parseInt(valueStr, 10)];
      })
    );
    // const requestBody = { version, input: inputData };
    const requestBody = { version, input: formData };
    console.log("INPUT DATA", inputData);
    console.log("SENT TO BACKEND", requestBody);
    const response = await fetch("/api/output", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    let prediction = await response.json();
    if (response.status !== 200) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    if (prediction.status === 422) {
      console.error("Prediction error:", prediction.detail);
      alert(`Prediction Error: ${prediction.detail}`);
      return;
    }

    const predictionId = prediction.id;
    console.log(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch(`/api/output?id=${predictionId}`);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }

      setPrediction(prediction);
      setGlobalPredictions(prediction);
    }
    console.log("Prediction", prediction);

    setFormData(initialFormData);
    setResetKey((prevKey) => prevKey + 1);
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setResetKey((prevKey) => prevKey + 1);
  };

  console.log("FORMDATA", formData);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {Object.entries(schema)
        .sort(([, a], [, b]) => (a["x-order"] || 0) - (b["x-order"] || 0))
        .map(([key, field]) => (
          <div key={key} className="flex flex-col">
            <div className="flex justify-between">
              <div className="flex items-center gap-x-2">
                <label
                  htmlFor={key}
                  className="text-sm font-medium text-gray-700"
                >
                  {key}
                </label>
                <div>
                  <div className="text-sm text-opacity-50 opacity-50">
                    {field.type}
                  </div>
                </div>
              </div>

              {field.minimum ||
                (field.maximum && (
                  <div className="opacity-50 text-sm">
                    (Minimum: {field.minimum}, maximum: {field.maximum})
                  </div>
                ))}
            </div>

            {["top", "bottom", "right", "left"].includes(key) ? (
              <select
                id={key}
                name={key}
                value={
                  formData[key] !== undefined ? formData[key].toString() : ""
                }
                onChange={(event) => handleInputChange(event, key)}
                className="mt-1 px-2 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 outline-none"
              >
                <option value="0">0</option>
                <option value="256">256</option>
                <option value="512">512</option>
                <option value="768">768</option>
              </select>
            ) : field.type === "boolean" ? (
              <select
                id={key}
                name={key}
                value={
                  formData[key] !== undefined ? formData[key].toString() : ""
                }
                onChange={(event) => handleBooleanInputChange(event, key)}
                className="mt-1 px-2 py-2 block w-full border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 outline-none"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            ) : key === "input_audio" ||
              key === "audio" ||
              key === "source_video_path" ||
              key === "video_path" ||
              key === "input_video" ||
              key === "video" ||
              key === "image" ||
              key === "input_image" ||
              key === "ref_image_path" ||
              field.type === "file" ||
              field.format === "uri" ? (
              <>
                {selectedFiles[key] && (
                  <div className="text-[.75rem] opacity-40">
                    {selectedFiles[key]}
                  </div>
                )}

                <FileUpload
                  onDrop={(acceptedFiles) => handleDrop(acceptedFiles, key)}
                />
              </>
            ) : typeof field.default === "string" &&
              field.default.length > 20 ? (
              <textarea
                id={key}
                name={key}
                value={(formData[key] as string) || ""}
                onChange={(event) => handleInputChange(event, key)}
                className="mt-1 px-2 py-2 block w-full border-black border  shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 outline-none resize-none"
              />
            ) : (
              <input
                type={field.type || "number"}
                id={key}
                name={key}
                value={(formData[key] as string) || ""}
                onChange={(event) => handleInputChange(event, key)}
                className="mt-1 px-2 py-2 block w-full border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 outline-none"
              />
            )}
            <div className="mt-1 opacity-60 text-[0.75rem]">
              <div>{field.description}</div>
              <div>Default: {field.default}</div>
            </div>
          </div>
        ))}
      <div className="flex gap-4 justify-end">
        <div
          className="font-bold py-2 px-4 rounded border border-black"
          onClick={handleReset}
        >
          Reset
        </div>
        <div className="bg-black text-white font-bold py-2 px-4 rounded">
          <button type="submit">Boot + Run</button>
        </div>
      </div>
    </form>
  );
};

export default DynamicForm;
