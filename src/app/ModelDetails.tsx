// app/pages/model-details.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface ModelProps {
  name: string;
  owner: string;
  cover_image_url: string;
}

export default function ModelDetails() {
  const router = useRouter();
  const { owner, name } = router.query;
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
    <div>
      <h1>{modelDetails.name}</h1>
      {/* Render other model details here */}
      <p>Owner: {modelDetails.owner}</p>
      {/* <p>Description: {modelDetails.description}</p> */}
      {/* Add more details as needed */}
    </div>
  );
}
