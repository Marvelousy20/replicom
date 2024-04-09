"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import ModelItem from "@/components/ModelItem";
import { useRouter } from "next/navigation";
import { usePredictionContext } from "@/context/prediction";

interface ModelProps {
  cover_image_url: string;
  name: string;
  owner: string;
  createdAt: string;
  description: string;
}

interface AllModels {
  next: string;
}

export default function Home() {
  const [models, setModels] = useState<ModelProps[] | []>([]);
  const [allModels, setAllModels] = useState<AllModels | null>(null);

  const getModels = async () => {
    try {
      const response = await fetch("/api");
      const result = await response.json();
      setModels(result.results);
      setAllModels(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextClick = async () => {
    if (allModels?.next) {
      const response = await fetch(
        `/api?url=${encodeURIComponent(allModels.next)}`
      );
      const result = await response.json();
      setModels((prevModels) => [...prevModels, ...result.results]);
      setAllModels(result);
    }
  };

  useEffect(() => {
    getModels();
  }, []);

  const { setPrediction } = usePredictionContext();

  useEffect(() => {
    // This cleanup function runs when the component unmounts
    return () => {
      // Reset the prediction state when navigating away from this page
      setPrediction(null);
    };
  }, [setPrediction]);

  console.log(allModels);
  return (
    <main className="">
      <h1 className="text-4xl text-center font-bold mb-10">Public Models</h1>

      {models.length >= 1 && (
        <div>
          <div className="flex flex-wrap gap-y-10 gap-x-4 space-y-10 justify-between md:px-10 px-5">
            {models.map((model, index) => {
              return (
                <div key={index}>
                  <ModelItem
                    cover_image_url={model.cover_image_url}
                    name={model.name}
                    owner={model.owner}
                  />
                </div>
              );
            })}
          </div>
          <div
            className="text-white mt-20 font-bold flex justify-center"
            onClick={handleNextClick}
          >
            {allModels?.next ? (
              <button className="bg-blue-500 hover:bg-opacity-60 w-48 py-4">
                View More
              </button>
            ) : null}
          </div>
        </div>
      )}
    </main>
  );
}
