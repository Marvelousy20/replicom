"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import DynamicForm from "@/component/DynamicForm";

interface ModelProps {
  cover_image_url: string;
  name: string;
  owner: string;
  createdAt: string;
  description: string;
  run_count: number;
}

const inputSchema = {
  bottom: {
    type: "integer",
    title: "Bottom",
    default: 0,
    description: "Outpainting on bottom",
  },
  feathering: {
    type: "integer",
    title: "Feathering",
    default: 40,
    description: "Type the feathering",
  },
  image: {
    type: "string",
    title: "Image",
    format: "uri",
    description: "Image",
  },
  left: {
    type: "integer",
    title: "Left",
    default: 0,
    description: "Outpainting on left",
  },
  right: {
    type: "integer",
    title: "Right",
    default: 0,
    description: "Outpainting on right",
  },
  seed: {
    type: "integer",
    title: "Seed",
    description: "Fill in with seed number",
  },
  top: {
    type: "integer",
    title: "Top",
    default: 0,
    description: "Outpainting on top",
  },
};

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

  console.log(modelDetails);
  return (
    <Suspense>
      <div className="flex flex-col items-center">
        <div>
          <div
            className="mb-4 bg-blue-500 p-2 px-6 inline-flex rounded-md text-white"
            onClick={() => router.back()}
          >
            Back
          </div>
          {/* Content */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            {/* Output */}
            <div>
              <h2 className="mb-4 text-3xl">INPUT</h2>
              {modelDetails.cover_image_url ? (
                <Image
                  src={modelDetails.cover_image_url}
                  alt="img"
                  width={700}
                  height={400}
                />
              ) : (
                <div className="h-[400px] w-300px lg:w-[500px] bg-red-500"></div>
              )}
              <h1 className="text-3xl mt-4 font-bold">
                Name: {modelDetails.name}
              </h1>
              <p className="text-lg font-bold">Owner: {modelDetails.owner}</p>

              <h1 className="text-lg mt-4">
                Description: {modelDetails.description}
              </h1>
              {/* <h1 className="text-lg mt-4">Created At: {modelDetails.createdAt}</h1> */}
              <p className="text-lg">Run Count: {modelDetails.run_count}</p>

              {/* Dynamic Input */}
              <div className="mt-10">

              </div>
            </div>

            {/* Input */}
            <div>
              <h2 className="mb-4 text-3xl">OUTPUT</h2>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
