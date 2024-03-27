"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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
  const router = useRouter();

  //   const getModelDetails = async (owner: string, name: string) => {
  //     try {
  //       const response = await fetch(`/api/model?owner=${owner}&name=${name}`);
  //       const result = await response.json();
  //       console.log("DETAILS", result);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  return (
    <Link href={`/model-detail?owner=${owner}&name=${name}`}>
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
    </Link>
  );
}
