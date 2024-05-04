"use client";
import { useState, useEffect } from "react";
import ModelItem from "@/components/ModelItem";
import { usePredictionContext } from "@/context/prediction";
import axios from "axios";
import { Pagination } from "antd";
import SearchBar from "@/components/search-bar/search-bar";
import { useTheme } from "next-themes";
import Loader from "@/components/Loader";
import headerData from '../data/header.json';
import collectlistData from '../data/collectionlist.json'
import { ModelListCollectionType } from "../../types/modelInterface";
import ModelListCollection from "@/components/CollectionItem";
import LatestModelItem from "@/components/LatestModelItem";

const Page = () => {
  // const [searchString, setSearchString] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [loadedModules, setLoadedModules] = useState<any[]>([]);
  const [displayedModules, setDisplayedModules] = useState<any[]>([]);
  const [filteredModules, setFilteredModules] = useState<any[]>([]);
  const [headModules, setHeadModules] = useState<any[]>([]);
  const [collectionModules, setCollectionModules] = useState<ModelListCollectionType[]>([]);
  const { setPrediction, searchString, setSearchString } =
    usePredictionContext();

  useEffect(() => {
    const filtered = searchString
      ? loadedModules.filter((module) =>
        module.name?.toLowerCase().includes(searchString.toLowerCase())
      )
      : loadedModules;
    setFilteredModules(filtered);
    if (searchString) {
      setCurrentPage(1);
      updateDisplayedModules(filtered, 1);
    } else {
      updateDisplayedModules(filtered, currentPage);
    }
  }, [searchString, loadedModules]);

  useEffect(() => {
    return () => {
      // Reset the prediction state when navigating away from this page
      setPrediction(null);
    };
  }, [setPrediction]);

  async function getData() {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/replicate/`
    );
    // const listresponse = await axios.get("/api/listcollection");

    // setCollectionModules(listresponse.data?.results)
    setCollectionModules(collectlistData)
    setLoadedModules(response.data);
    setHeadModules(headerData);
    updateDisplayedModules(response.data, currentPage);
  }

  useEffect(() => {
    getData();
  }, []);

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
    updateDisplayedModules(filteredModules, page);
  };

  const updateDisplayedModules = (modules: any[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedModules(modules.slice(startIndex, endIndex));
  };

  const { theme } = useTheme();
  console.log(collectionModules, "list collection")
  return (
    <>
      <main className="mt-[88px] h-full w-full bg-[url(/img/dots-bg.svg)] dark:bg-[url(/img/dot-bg-dark.svg)] px-[40px] ">
        <div className="md:px-10 px-5">
          {/* <SearchBar
            setSearchString={setSearchString}
            searchString={searchString}
          /> */}
        </div>
        <h1 className="dark:text-[white] text-[black] text-[40px] pb-[48px] font-bold pt-[20px]">Explore</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3  gap-y-10 gap-x-[48px] justify-center pb-[48px]">
          {
            headModules.map((model, idx) => (
              <ModelItem
                key={idx}
                cover_image_url={model.image_url}
                name={model.name}
                owner={model.owner}
                github={model.github_url}
                description={model.description}
              />
            ))
          }
        </div>

        {collectionModules && collectionModules.length > 0 ? (
          <div>
            <hr className="pb-[48px] dark:text-white"></hr>
            <h1 className="dark:text-[white] text-[black] text-[28px] pb-[48px]">I want to ...</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-10 gap-x-[48px] justify-center  lg:justify-between pb-[48px]">

              {[...collectionModules].reverse().map((model, idx) => (
                <ModelListCollection key={idx} name={model.name} description={model.description} slug={model.slug} />
              ))}
            </div>
            <hr className="pb-[48px]"></hr>
          </div>
        ) : (<></>)

        }

        {displayedModules && displayedModules.length > 0 ? (
          <>
            <h1 className="dark:text-[white] text-[black] text-[28px] pb-[48px]">Latest models</h1>
            <div className="grid grid-cols-1  lg:grid-cols-2 gap-y-10 gap-x-[48px]">
              {displayedModules.map((model, idx) => (
                <LatestModelItem
                  key={idx}
                  cover_image_url={model.image_url}
                  name={model.name}
                  owner={model.owner}
                  github={model.github_url}
                  description={model.description}
                />
              ))}
            </div>
            <div className="flex items-center my-[30px] ">
              <Pagination
                current={currentPage}
                total={filteredModules.length}
                defaultPageSize={50}
                showSizeChanger={false}
                onChange={handlePageChange}
                className={`${theme} mx-auto`}
              />
            </div>
          </>
        ) : (
          <span className="md:px-10 px-5 text-[26px]">
            <Loader />
          </span>
        )}
      </main>
    </>
  );
};

export default Page;

