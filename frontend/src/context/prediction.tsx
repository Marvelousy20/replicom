"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface PredictionMetrics {
  predict_time: number;
  total_time: number;
}

export interface Prediction {
  id: string;
  status: "starting" | "processing" | "canceled" | "succeeded" | "failed";
  metrics?: PredictionMetrics;
  output: string | string[];
  created_at: string;
  error: string;
}

interface PredictionContextType {
  prediction: Prediction | null;
  setPrediction: React.Dispatch<React.SetStateAction<Prediction | null>>;
  showInitialImage: boolean;
  setShowInitialImage: React.Dispatch<React.SetStateAction<boolean>>;
  searchString: string;
  setSearchString: React.Dispatch<React.SetStateAction<string>>;
}

const PredictionContext = createContext<PredictionContextType | undefined>(
  undefined
);

export const PredictionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [showInitialImage, setShowInitialImage] = useState(true);
  const [searchString, setSearchString] = useState("");

  return (
    <PredictionContext.Provider
      value={{
        prediction,
        setPrediction,
        showInitialImage,
        setShowInitialImage,
        searchString,
        setSearchString,
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
};

export const usePredictionContext = () => {
  const context = useContext(PredictionContext);
  if (context === undefined) {
    throw new Error(
      "usePredictionContext must be used within a PredictionProvider"
    );
  }
  return context;
};
