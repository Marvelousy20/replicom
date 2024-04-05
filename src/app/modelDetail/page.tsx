"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import DynamicForm from "@/components/DynamicForm";
import { InputSchema } from "../../../types";
import { usePredictionContext } from "@/context/prediction";
import Loading from "@/components/Loading";
import DynamicForms from "@/components/DynamicForms";
import { ArrowLeft } from "lucide-react";

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
  const { globalPredictions, setGlobalPredictions } = usePredictionContext();

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
    router.back();
    setGlobalPredictions(null);
  };

  console.log(globalPredictions);
  // console.log(schemas);

  return (
    <Suspense>
      <div className="flex flex-col items-center">
        <div className="px-4 lg:px-16">
          <div className="mb-4 inline-flex" onClick={handleBack}>
            <ArrowLeft />
          </div>
          {/* Content */}

          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 mt-8 gap-10 justify-center flex-wrap border-t-2 h-full">
              {/* Input */}
              <div className="!col-span-1 mt-4">
                <h2 className="mb-4 text-2xl">INPUT</h2>
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
                  {globalPredictions?.status === "starting" ? (
                    <Loading />
                  ) : null}
                </h2>
                {globalPredictions && (
                  <div>
                    {globalPredictions.output && (
                      <div>
                        <Image
                          src={globalPredictions.output}
                          alt="image"
                          width={700}
                          height={400}
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      status: {globalPredictions.status}
                    </div>
                  </div>
                )}
              </div>
              <div className="vertical-line lg:block hidden opacity-20"></div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
