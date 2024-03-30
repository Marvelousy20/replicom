import React, { useState, ChangeEvent } from "react";
import { InputSchema } from "../../types";

type FormData = {
  [key: string]: string | number;
};

type DynamicFormProps = {
  schema: InputSchema;
  version: string;
};

const DynamicForm: React.FC<DynamicFormProps> = ({ schema, version }) => {
  const [formData, setFormData] = useState<FormData>({});

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
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
    console.log(formData);
    const response = await fetch("/api/output", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {Object.entries(schema).map(([key, field]) => (
        <div key={key} className="flex flex-col">
          <label htmlFor={key} className="text-sm font-medium text-gray-700">
            {key}
          </label>
          {field.type === "file" ? (
            <input
              type="file"
              id={key}
              name={key}
              onChange={(event) => handleInputChange(event, key)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          ) : (
            <input
              type={field.type || "text"}
              id={key}
              name={key}
              defaultValue={field.default?.toString() || ""}
              onChange={(event) => handleInputChange(event, key)}
              className="mt-1 px-2 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 outline-none"
              //   />
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
