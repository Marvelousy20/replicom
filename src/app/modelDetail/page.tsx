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

  const [modelDetails, setModelDetails] = useState<ModelProps | null>(null);
  // const { prediction, setGlobalPredictions, setIsPredictionCanceled } =
  //   usePredictionContext();

  const { prediction, setPrediction, showInitialImage } =
    usePredictionContext();
  const [isCanceling, setIsCanceling] = useState(false);

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
        setPrediction(canceledPrediction);
        console.log(
          "CANCELELED PREDICTION INSIDEMODEL DETAILS",
          canceledPrediction
        );
        console.log("PREDICTION INSIDE MODEL DETAIL", prediction);
      } catch (error) {
        console.error("Error canceling prediction:", error);
      } finally {
        setIsCanceling(false);
      }
    }
  };

  return (
    <Suspense>
      <div className="flex flex-col items-center w-full">
        <div className="px-4 lg:px-16 w-full">
          <div className="mb-4 inline-flex" onClick={handleBack}>
            <ArrowLeft />
          </div>
          {/* Content */}

          <p className="text-xl font-bold mt-4">{modelDetails.name}</p>
          <p>{modelDetails.description}</p>
          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 mt-3 gap-10 justify-center flex-wrap border-t-2 h-full">
              {/* Input */}
              <div className="!col-span-1 mt-2">
                <h2 className="mb-4 text-2xl">INPUT</h2>

                {/* {modelDetails.cover_image_url ? (
                  <Image
                    src={modelDetails.cover_image_url}
                    alt="img"
                    width={700}
                    height={400}
                    priority
                  />
                ) : (
                  <div className="h-[400px] w-300px lg:w-[500px] bg-red-500"></div>
                )} */}

                {/* Dynamic Input */}
                <div className="mt-10">
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
                {showInitialImage ? (
                  <Image
                    src={modelDetails.cover_image_url}
                    alt="img"
                    width={700}
                    height={400}
                    priority
                  />
                ) : (
                  prediction?.output && (
                    <div>
                      {Array.isArray(prediction?.output) ? (
                        prediction.output.map((url, index) => (
                          <div key={index}>
                            {url.endsWith(".mp4") ||
                            url.endsWith(".webm") ||
                            url.endsWith(".ogg") ? (
                              // Render a video element if the URL ends with a video file extension
                              <video controls width="700" height="400">
                                <source src={url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            ) : url.endsWith(".mp3") ||
                              url.endsWith(".wav") ||
                              url.endsWith(".ogg") ? (
                              // Render an audio element if the URL ends with an audio file extension
                              <audio controls>
                                <source src={url} type="audio/mpeg" />
                                Your browser does not support the audio element.
                              </audio>
                            ) : (
                              // Render an image element otherwise
                              <Image
                                src={url}
                                alt={`image ${index + 1}`}
                                width={700}
                                height={400}
                              />
                            )}
                          </div>
                        ))
                      ) : (
                        <div>
                          {prediction.output.endsWith(".mp4") ||
                          prediction.output.endsWith(".webm") ||
                          prediction.output.endsWith(".ogg") ? (
                            // Render a video element if the URL ends with a video file extension
                            <video controls width="700" height="400">
                              <source
                                src={prediction.output}
                                type="video/mp4"
                              />
                              Your browser does not support the video tag.
                            </video>
                          ) : prediction.output.endsWith(".mp3") ||
                            prediction.output.endsWith(".wav") ||
                            prediction.output.endsWith(".ogg") ? (
                            // Render an audio element if the URL ends with an audio file extension
                            <audio controls>
                              <source
                                src={prediction.output}
                                type="audio/mpeg"
                              />
                              Your browser does not support the audio element.
                            </audio>
                          ) : (
                            // Render an image element otherwise
                            <Image
                              src={prediction.output}
                              alt="image"
                              width={700}
                              height={400}
                            />
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-4">
                        predict_time: {prediction?.metrics?.predict_time}{" "}
                        seconds
                      </div>
                    </div>
                  )
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
                      className="w-[100px] h-[40px] flex items-center justify-center text-white mt-4 border"
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
