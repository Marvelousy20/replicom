"use client"
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";
import ModelItem from "@/components/ModelItem";
import Loader from "@/components/Loader";

export default function ModelCollectionList() {

    const slug = useParams().slug;
    const [displayedModules, setDisplayedModules] = useState<any[]>([]);

    async function getData() {
        const response = await axios.get(
            `/api/listcollection/models?slug=${slug}`
        );
        const orderedModels = [...response.data.models].sort((a, b) => b.run_count - a.run_count);
        setDisplayedModules(orderedModels)
        console.log(response.data.models, "slug");
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            {displayedModules && displayedModules.length > 0 ? (
                <div className="mt-[112px] mb-[50px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-10 gap-x-[48px] justify-center  lg:justify-between px-[48px]">
                        {displayedModules.map((model, idx) => (
                            <ModelItem
                                key={idx}
                                cover_image_url={model.cover_image_url}
                                name={model.name}
                                owner={model.owner}
                                github={model.github_url}
                                description={model.description}
                            />
                        ))}
                    </div>

                </div>
            ) : (
                <span className="md:px-10 px-5 text-[26px]">
                    <Loader />
                </span>
            )}
        </>
    )
}