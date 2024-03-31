import React, { useState, ChangeEvent } from "react";
import { InputSchema } from "../../types";

type FormData = {
  [key: string]: string | number;
};

type DynamicFormProps = {
  schema: InputSchema;
  version: string;
};

type OutputProps = {
  id: string;
  model: string;
};

const DynamicForm: React.FC<DynamicFormProps> = ({ schema, version }) => {
  const [formData, setFormData] = useState<FormData>({});
  const [output, setOput] = useState({});

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const inputData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => {
        const valueStr = typeof value === "number" ? value.toString() : value;

        return [key, parseInt(valueStr, 10)];
      })
    );
    const requestBody = { version, input: inputData };
    console.log("Request Body:", JSON.stringify(requestBody, null, 2));

    const response = await fetch("/api/output", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json();
    console.log("DATA", data);

    const predictionId = data.id;
    const predictionResult = await pollPrediction(predictionId);
    setOput(predictionResult);
  };

  async function pollPrediction(
    predictionId: string,
    interval = 5000,
    maxAttempts = 10
  ) {
    let attempts = 0;
    while (attempts < maxAttempts) {
      const response = await fetch(`/api/output?id=${predictionId}`, {
        headers: {
          Authorization: `Token ${process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.status === "completed") {
        console.log("Prediction completed:", data);
        return data;
      } else if (data.status === "failed") {
        console.error("Prediction failed:", data);
        return null;
      }

      attempts++;
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    console.error("Max attempts reached without completion.");
    return null;
  }

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
              value={formData[key] || ""}
              onChange={(event) => handleInputChange(event, key)}
              className="mt-1 px-2 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 outline-none"
            >
              <option value="0">0</option>
              <option value="256">256</option>
              <option value="512">516</option>
              <option value="768">768</option>
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
