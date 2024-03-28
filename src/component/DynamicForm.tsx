"use client";
import { InputSchema } from "../../types";
import { useState, ChangeEvent } from "react";

type FormData = {
  [key: string]: string | number;
};

type DynamicFormProps = {
  schema: InputSchema;
};

export default function DynamicForm({ schema }: DynamicFormProps) {
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
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    console.log(data);
    // Handle the response as needed
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.entries(schema).map(([key, field]) => (
        <div key={key}>
          <label htmlFor={key}>{field.title}</label>
          <input
            type={field.type}
            id={key}
            name={key}
            defaultValue={field.default?.toString() || ""}
            onChange={(event) => handleInputChange(event, key)}
          />
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}
