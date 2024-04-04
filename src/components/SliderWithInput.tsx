"use client";

import React, { useState } from "react";
import { Slider } from "@/components/ui/slider"; // Adjust the import path as necessary

interface SliderProps {
  defaultValue: number;
  max: number;
  min: number;
  inputKey: string;
  onValueChange: (inputKey: string, value: number | null) => void;
}

const SliderWithInput = ({
  defaultValue,
  max,
  min,
  inputKey,
  onValueChange,
}: SliderProps) => {
  const [sliderValue, setSliderValue] = useState<number | null>(defaultValue);

  const handleSliderChange = (values: number[]) => {
    const newValue = values[0];
    setSliderValue(newValue);
    onValueChange(inputKey, newValue);
    console.log(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= min && value <= max) {
      setSliderValue(value);
      onValueChange(inputKey, value);
    } else if (e.target.value === "") {
      setSliderValue(null);
      onValueChange(inputKey, null);
    }
  };

  return (
    <div className="flex gap-4">
      <input
        type="number"
        id={inputKey}
        name={inputKey}
        value={sliderValue !== null ? sliderValue : ""}
        onChange={handleInputChange}
        className="mt-1 px-2 py-2 block w-1/6 border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 outline-none"
      />
      <Slider
        max={max}
        min={min}
        defaultValue={[Number(defaultValue)]}
        value={[sliderValue !== null ? sliderValue : min]}
        onValueChange={handleSliderChange}
        step={0.1}
      />
    </div>
  );
};

export default SliderWithInput;
