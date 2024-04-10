// "use client";

// import React, {
//   createContext,
//   useState,
//   useContext,
//   ReactNode,
//   useRef,
//   useEffect,
// } from "react";

// // Define the type for the object state
// type globalPredictions = {
//   [key: string]: any; // You can replace 'any' with the specific type of your object's values
// };
// // Define the type for the cancellation token

// // Define the type for the context
// type PredictionContextType = {
//   globalPredictions: globalPredictions | null;
//   setGlobalPredictions: React.Dispatch<React.SetStateAction<globalPredictions> | null>;
//   isPredictionCanceled: boolean;
//   setIsPredictionCanceled: React.Dispatch<React.SetStateAction<boolean>>;
// };

// // Create a context with an initial state
// const PredictionContext = createContext<PredictionContextType | undefined>(
//   undefined
// );

// // Create a provider component to wrap your app and provide the context
// export const PredictionContextProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [globalPredictions, setGlobalPredictions] =
//     useState<globalPredictions | null>(null);
//   const [isPredictionCanceled, setIsPredictionCanceled] = useState(false);

//   return (
//     <PredictionContext.Provider
//       value={{
//         globalPredictions,
//         setGlobalPredictions,
//         isPredictionCanceled,
//         setIsPredictionCanceled,
//       }}
//     >
//       {children}
//     </PredictionContext.Provider>
//   );
// };
// export const usePredictionContext = (): PredictionContextType => {
//   const context = useContext(PredictionContext);
//   if (!context) {
//     throw new Error(
//       "usePredictionContext must be used within a PredictionContextProvider"
//     );
//   }
//   return context;
// };

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
  // updatePrediction: (newPrediction: Prediction) => void;
  // clearPrediction: () => void;
  setPrediction: React.Dispatch<React.SetStateAction<Prediction | null>>;
  showInitialImage: boolean;
  setShowInitialImage: React.Dispatch<React.SetStateAction<boolean>>;
}

const PredictionContext = createContext<PredictionContextType | undefined>(
  undefined
);

export const PredictionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [showInitialImage, setShowInitialImage] = useState(true);

  const updatePrediction = (newPrediction: Prediction) => {
    setPrediction(newPrediction);
  };

  const clearPrediction = () => {
    setPrediction(null);
  };

  return (
    <PredictionContext.Provider
      value={{
        prediction,
        setPrediction,
        showInitialImage,
        setShowInitialImage,
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
