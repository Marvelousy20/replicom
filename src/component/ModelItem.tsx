"use client";

import Image from "next/image";
interface ModelItemProps {
  id: string;
  cover_image_url: string;
  name: string;
  owner: string;
}

export default function ModelItem({
  cover_image_url,
  name,
  owner,
}: ModelItemProps) {
  const getModelDetails = async (owner: string, name: string) => {
    try {
      const response = await fetch(`/api/model?owner=${owner}&name=${name}`);
      const result = await response.json();
      console.log("DETAILS", result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div onClick={() => getModelDetails(owner, name)}>
      {cover_image_url !== null ? (
        <div className="h-[300px] w-[300px]">
          <Image
            src={cover_image_url}
            alt="cover"
            width={200}
            height={200}
            className="h-full w-full"
          />
        </div>
      ) : (
        <div className="h-[200px] w-[200px] !bg-red-400"></div>
      )}
      <h2>{name}</h2>
    </div>
  );
}
