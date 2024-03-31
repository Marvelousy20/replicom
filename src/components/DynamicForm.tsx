import React, { useState, ChangeEvent } from "react";
import { InputSchema } from "../../types";
import { usePredictionContext } from "@/coontext/prediction";
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
  const [formData, setFormData] = useState<FormData>({});
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const { setGlobalPredictions } = usePredictionContext();

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: string
  ) => {
    const value =
      event.target.type === "number"
        ? parseFloat(event.target.value)
        : event.target.value;
    setFormData({ ...formData, [key]: value });
  };

  const handleBooleanInputChange = (
    event: ChangeEvent<HTMLSelectElement>,
    key: string
  ) => {
    const value = event.target.value === "true"; // Convert string "true" or "false" to boolean
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const inputData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => {
        if (typeof value === "boolean") {
          return [key, value];
        }
        if (
          key === "image" ||
          (key === "input_image" && typeof value === "string")
        ) {
          return [key, image];
        }
        const valueStr = typeof value === "number" ? value.toString() : value;

        return [key, parseInt(valueStr, 10)];
      })
    );
    const requestBody = { version, input: inputData };
    console.log(requestBody);
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
    const predictionId = prediction.id;

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

    setFormData({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {Object.entries(schema).map(([key, field]) => (
        <div key={key} className="flex flex-col">
          <label htmlFor={key} className="text-sm font-medium text-gray-700">
            {key}
          </label>
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
              <option value="512">516</option>
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
              className="mt-1 px-2 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 outline-none"
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          ) : (
            <input
              type={field.type || "number"}
              id={key}
              name={key}
              defaultValue={field.default?.toString() || ""}
              onChange={(event) => handleInputChange(event, key)}
              className="mt-1 px-2 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 outline-none"
            />
          )}
          <small className="mt-1">{field.description}</small>
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
