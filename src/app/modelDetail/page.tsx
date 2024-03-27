"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

interface ModelProps {
  cover_image_url: string;
  name: string;
  owner: string;
  createdAt: string;
  description: string;
  run_count: number;
}

export default function ModelDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const name = searchParams.get("name");
  const owner = searchParams.get("owner");
  console.log(owner, name);
  const [modelDetails, setModelDetails] = useState<ModelProps | null>(null);

  useEffect(() => {
    if (owner && name) {
      const fetchModelDetails = async () => {
        try {
          const response = await fetch(
            `/api/model?owner=${owner}&name=${name}`
          );
          const data = await response.json();
          setModelDetails(data);
        } catch (error) {
          console.error("Failed to fetch model details", error);
        }
      };

      fetchModelDetails();
    }
  }, [owner, name]);

  if (!modelDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div>
        <div className="mb-4 bg-blue-500 p-2 px-6 inline-flex rounded-md text-white" onClick={() => router.back()}>
          Back
        </div>
        {modelDetails.cover_image_url ? (
          <Image
            src={modelDetails.cover_image_url}
            alt="img"
            width={700}
            height={400}
          />
        ) : (
          <div className="h-[400px] w-[700px] bg-red-500"></div>
        )}
        <h1 className="text-3xl mt-4 font-bold">Name: {modelDetails.name}</h1>
        <p className="text-lg font-bold">Owner: {modelDetails.owner}</p>

        <h1 className="text-lg mt-4">
          Description: {modelDetails.description}
        </h1>
        {/* <h1 className="text-lg mt-4">Created At: {modelDetails.createdAt}</h1> */}
        <p className="text-lg">Run Count: {modelDetails.run_count}</p>
      </div>
    </div>
  );
}
