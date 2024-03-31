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
};

// Create a context with an initial state
const PredictionContext = createContext<PredictionContextType>({
  globalPredictions: {},
  setGlobalPredictions: () => {},
});

// Create a provider component to wrap your app and provide the context
export const PredictionContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [globalPredictions, setGlobalPredictions] =
    useState<globalPredictions | null>(null);

  return (
    <PredictionContext.Provider
      value={{ globalPredictions, setGlobalPredictions }}
    >
      {children}
    </PredictionContext.Provider>
  );
};

// Custom hook to easily access the context
export const usePredictionContext = (): PredictionContextType =>
  useContext(PredictionContext);
