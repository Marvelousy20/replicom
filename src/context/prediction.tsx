"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the type for the object state
type globalPredictions = {
  [key: string]: any; // You can replace 'any' with the specific type of your object's values
};

// Define the type for the context
type PredictionContextType = {
  globalPredictions: globalPredictions | null;
  setGlobalPredictions: React.Dispatch<React.SetStateAction<globalPredictions> | null>;
  isCanceled: boolean;
  setIsCanceled: (value: boolean) => void;
};

// Create a context with an initial state
const PredictionContext = createContext<PredictionContextType | undefined>(
  undefined
);

// Create a provider component to wrap your app and provide the context
export const PredictionContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [globalPredictions, setGlobalPredictions] =
    useState<globalPredictions | null>(null);
  const [isCanceled, setIsCanceled] = useState(false);

  return (
    <PredictionContext.Provider
      value={{
        globalPredictions,
        setGlobalPredictions,
        isCanceled,
        setIsCanceled,
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
};
export const usePredictionContext = (): PredictionContextType => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error(
      "usePredictionContext must be used within a PredictionContextProvider"
    );
  }
  return context;
};
