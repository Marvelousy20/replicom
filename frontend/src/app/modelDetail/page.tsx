"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import { InputSchema } from "../../../types";
import { usePredictionContext } from "@/context/prediction";
import Loading from "@/components/Loading";
import DynamicForms from "@/components/DynamicForms";
import { ArrowLeft } from "lucide-react";
import { Loader } from "@mantine/core";
import { formatTimestamp } from "@/lib/utils";
import axios from "axios";

interface Component {
  schemas: {
    Input: {
      properties: {
        bottom: string;
        feathering: string;
        image: string;
        left: string;
        right: string;
      }[];
    };
  };
}
interface Version {
  components: Component[];
}

interface ModelProps {
  cover_image_url: string;
  name: string;
  owner: string;
  createdAt: string;
  description: string;
  run_count: number;
  latestVersion: {
    id: string;
    openapi_schema?: {
      components?: {
        schemas?: {
          Input?: {
            properties?: InputSchema;
          };
        };
      };
    };
  };
}

export default function ModelDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const name = searchParams.get("name");
  const owner = searchParams.get("owner");

  let userDataString = null;
  if (typeof window !== "undefined") {
    userDataString = localStorage.getItem("userData");
  }
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const walletAddress = userData?.walletAddress;

  const model = owner + "/" + name;

  const [modelDetails, setModelDetails] = useState<ModelProps | null>(null);

  const { prediction, setPrediction, showInitialImage, setShowInitialImage } =
    usePredictionContext();

  const [isCanceling, setIsCanceling] = useState(false);
  // console.log("MODEL DETAILS", modelDetails);

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
      setShowInitialImage(true);
    }
  }, [owner, name]);

  const inputSchema =
    (modelDetails as any)?.latest_version?.openapi_schema?.components?.schemas
      ?.Input?.properties || {};

  const schemas =
    (modelDetails as any)?.latest_version?.openapi_schema?.components
      ?.schemas || {};

  if (!modelDetails) {
    return <div className="px-4 lg:px-16">Loading...</div>;
  }

  const version = (modelDetails as any)?.latest_version?.id;

  const handleBack = () => {
    setPrediction(null);
    router.back();
  };

  const cancelPrediction = async () => {
    if (
      prediction &&
      (prediction.status === "starting" || prediction.status === "processing")
    ) {
      setIsCanceling(true);
      try {
        const response = await fetch(`/api/model?id=${prediction.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Network response was not ok.");

        const canceledPrediction = await response.json();

        const cancelPredictionResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/prediction/`,
          {
            walletAddress: `${walletAddress}`,
            status: "canceled",
            model: model,
            created: prediction?.created_at,
            time: "0.0",
          }
        );

        setPrediction(canceledPrediction);
      } catch (error) {
        console.error("Error canceling prediction:", error);
      } finally {
        setIsCanceling(false);
      }
    }
  };

  // Check if the output is a URL or structured data

  const renderOutput = (output: any) => {
    if (Array.isArray(output)) {
      return output.map((item, index) => (
        <div key={index}>{renderOutput(item)}</div>
      ));
    } else if (
      typeof output === "string" &&
      (output.startsWith("http://") || output.startsWith("https://"))
    ) {
      return renderMedia(output);
    } else if (typeof output === "object" && output !== null) {
      return <pre>{JSON.stringify(output, null, 2)}</pre>; // JSON formatting for objects
    } else {
      return <span>{output}</span>;
    }
  };

  const renderMedia = (url: string) => {
    if (url.match(/\.(mp4|webm|ogg)$/i)) {
      return (
        <video controls width="700" height="400">
          <source src={url} type={`video/${url.split(".").pop()}`} />
        </video>
      );
    } else if (url.match(/\.(mp3|wav|ogg)$/i)) {
      return (
        <audio controls>
          <source src={url} type={`audio/${url.split(".").pop()}`} />
        </audio>
      );
    } else {
      return <Image src={url} alt="Output" width={700} height={400} />;
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col items-center w-full text-black dark:text-white">
        <div className="px-4 lg:px-16 w-full">
          {/* <div className="mb-4 inline-flex" onClick={handleBack}>
            <ArrowLeft />
          </div> */}
          {/* Content */}

          <p className="text-3xl font-bold mt-12">{modelDetails.name}</p>
          <p className="pt-[20px]">{modelDetails.description}</p>
          <div className="relative mt-[40px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 mt-3 gap-10 justify-center flex-wrap border-t-2 h-full">
              {/* Input */}
              <div className="!col-span-1 mt-2">
                <h2 className="mb-4 text-2xl">INPUT</h2>

                {/* Dynamic Input */}
                <div className="mt-5">
                  <DynamicForms
                    schema={schemas}
                    version={version}
                    image={modelDetails.cover_image_url}
                  />
                </div>
              </div>

              {/* Output */}
              <div className="col-span-1 mt-4">
                <h2 className="mb-4 text-2xl flex items-center gap-2">
                  OUTPUT
                  {prediction?.status === "starting" ? <Loading /> : null}
                </h2>
                {showInitialImage && modelDetails.cover_image_url ? (
                  <Image
                    src={modelDetails?.cover_image_url}
                    alt="img"
                    width={700}
                    height={400}
                    priority
                  />
                ) : (
                  prediction?.output && renderOutput(prediction.output)
                )}

                {prediction?.id ? (
                  <div>
                    <div className="flex items-center gap-2">
                      status: {prediction?.status}
                    </div>
                  </div>
                ) : null}

                {prediction &&
                  (prediction?.status === "starting" ||
                    prediction?.status === "processing") && (
                    <button
                      className="w-[100px] h-[40px] flex items-center justify-center  mt-4 border"
                      onClick={cancelPrediction}
                    >
                      {isCanceling ? <Loader size={23} /> : "CANCEL"}
                    </button>
                  )}

                <div className="mt-1">
                  {prediction?.output && (
                    <span>
                      Date:
                      {formatTimestamp(prediction?.created_at).date}, Time:
                      {formatTimestamp(prediction?.created_at).time}
                    </span>
                  )}
                </div>

                <div className="mt-1">
                  {prediction?.status === "failed" && (
                    <span>Error: {prediction.error}</span>
                  )}
                </div>
              </div>
              <div className="vertical-line lg:block hidden opacity-20"></div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
