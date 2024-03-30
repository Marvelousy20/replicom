"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import ModelItem from "@/components/ModelItem";

interface ModelProps {
  cover_image_url: string;
  name: string;
  owner: string;
  createdAt: string;
  description: string;
}

export default function Home() {
  const [models, setModels] = useState<ModelProps[] | []>([]);
  // In your component
  const getModels = async () => {
    try {
      const response = await fetch("/api");
      const result = await response.json();
      setModels(result.results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getModels();
  }, []);
  return (
    <main className="">
      {/* Get all model */}

      <h1 className="text-4xl text-center font-bold mb-10">Public Models</h1>

      {models.length >= 1 && (
        <div className="flex flex-wrap gap-y-10 gap-x-4 space-y-10 justify-between">
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
      )}
    </main>
  );
}
