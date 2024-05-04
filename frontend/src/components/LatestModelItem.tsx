"use client";

import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import { useRouter } from "next/dist/client/components/navigation";
interface LatestModelItemProps {
  cover_image_url: string;
  name: string;
  owner: string;
  github: string;
  description: string;
}

export default function LatestModelItem({
  cover_image_url,
  name,
  owner,
  github,
  description
}: LatestModelItemProps) {
  const router = useRouter();

  const onClickGitHubHandle = () => {
    window.open(`${github}`, "_blank");
  };

  return (
    <div className="bg-transparent dark:bg-gray-900">
      <div className=" flex flex-row gap-x-[24px] ">
        <div
          className="cursor-pointer  w-[144px] h-[128px] flex justify-center items-center bg-slate-100"
          onClick={() =>
            router.push(`/modelDetail?owner=${owner}&name=${name}`)
          }
        >
          {cover_image_url ? (
            <Image
              src={cover_image_url}
              width={144}
              height={128}
              alt="Image"
              className="w-[144px] h-[128px] object-cover"
            />
          ) : (
            <Image
              className=" w-[40px] h-[40px]"
              src={"/img/back-logo.png"}
              width={32}
              height={32}
              alt="Image"
            />
          )}
        </div>
        <div className="p-[12px] w-[calc(100%-168px)]">
          <h4 className="   font-bold text-gray-800 text-[24px] dark:text-white">
            {owner}/{name}
          </h4>
          <p className="dark:text-white text-black mt-[15px]">
            {description}
          </p>
        </div>


        {/* <div className="flex gap-x-[10px] items-center absolute  top-[338px] right-[10px]">
          <FaGithub
            className="text-gray-800 w-[20px] h-[20px] cursor-pointer dark:text-white"
            onClick={() => onClickGitHubHandle()}
          />
        </div> */}
      </div>
    </div>
  );
}
