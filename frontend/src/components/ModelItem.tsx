"use client";

import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import { useRouter } from "next/dist/client/components/navigation";
interface ModelItemProps {
  cover_image_url: string;
  name: string;
  owner: string;
  github: string;
}

export default function ModelItem({
  cover_image_url,
  name,
  owner,
  github,
}: ModelItemProps) {
  const router = useRouter();

  const onClickGitHubHandle = () => {
    window.open(`${github}`, "_blank");
  };

  return (
    <div className="w-[350px] h-[420px] drop-shadow-[2px_2px_5px_rgba(0,0,0,0.16)] rounded-b-[7px] rounded-t-[7px] bg-slate-200">
      <div className="relative z-0 flex flex-col ">
        <div
          className="cursor-pointer absolute w-full h-[350px]"
          onClick={() =>
            router.push(`/modelDetail?owner=${owner}&name=${name}`)
          }
        >
          {cover_image_url ? (
            <Image
              src={cover_image_url}
              layout="fill"
              objectFit="cover"
              alt="Image"
              className="rounded-t-[7px]"
            />
          ) : (
            <Image
              className="hidden"
              src={""}
              layout="fill"
              objectFit="cover"
              alt="Image"
            />
          )}
        </div>
        <div>
          <h4 className="absolute top-[370px] left-[10px] max-w-full truncate  font-bold text-gray-800 text-xl w-[250px]">
            {name}
          </h4>
        </div>

        <div className="flex gap-x-[10px] items-center absolute  top-[375px] right-[10px]">
          <FaGithub
            className="text-gray-800 w-[20px] h-[20px] cursor-pointer"
            onClick={() => onClickGitHubHandle()}
          />
        </div>
      </div>
    </div>
  );
}
