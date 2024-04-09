"use client";
import { useState, useEffect } from "react";
import ModelItem from "@/components/ModelItem";
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
  const [searchQuery, setSearchQuery] = useState("");

  const getModels = async () => {
    try {
      const response = await fetch("/api");
      const result = await response.json();
      setModels(result.results);
      // This includes the all the data including the next and previous links.
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
    return () => {
      // Reset the prediction state when navigating away from this page
      setPrediction(null);
    };
  }, [setPrediction]);

  console.log("ALL MODELS", allModels);
  console.log("MODELS", models);

  // Filter all models
  const filteredModels = models.filter((model) =>
    model?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <main className="">
      <div className="md:px-10 px-5 flex items-center justify-between mb-10">
        <h1 className="text-4xl text-center font-bold">Public Models</h1>
        <input
          type="text"
          placeholder="Search models..."
          className="px-2 py-3 outline-none border w-2/6 rounded-sm"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
      </div>

      {models.length >= 1 && (
        <div>
          <div className="flex flex-wrap gap-y-10 gap-x-4 space-y-10 justify-between md:px-10 px-5">
            {/* {models.map((model, index) => {
              return (
                <div key={index}>
                  <ModelItem
                    cover_image_url={model.cover_image_url}
                    name={model.name}
                    owner={model.owner}
                  />
                </div>
              );
            })} */}
            {filteredModels.length > 0 ? (
              <div className="flex flex-wrap gap-y-10 gap-x-4 space-y-10 justify-between md:px-10 px-5">
                {filteredModels.map((model, index) => (
                  <div key={index}>
                    <ModelItem
                      cover_image_url={model.cover_image_url}
                      name={model.name}
                      owner={model.owner}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center">No models found.</p>
            )}
          </div>
          <div
            className="text-white mt-20 font-bold flex justify-center"
            onClick={handleNextClick}
          >
            {allModels?.next && filteredModels.length > 0 ? (
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
