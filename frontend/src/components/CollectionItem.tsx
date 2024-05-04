"use client";

import Image from "next/image";
import { useRouter } from "next/dist/client/components/navigation";
import { ModelListCollectionType } from "../../types/modelInterface";

export default function ModelListCollection({
    name,
    description,
    slug,
}: ModelListCollectionType) {
    const router = useRouter();



    return (
        <div>
            <h1 className="font-bold dark:text-white text-black text-[24px] pb-[10px]">
                <a href={`/collections/${slug}`} className="underline">{name}</a></h1>
            <p className="dark:text-white text-black "> {description} </p>
        </div>
    );
}
