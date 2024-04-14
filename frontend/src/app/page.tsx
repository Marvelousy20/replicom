"use client";
import { useState, useEffect } from "react";
import ModelItem from "@/components/ModelItem";
import { usePredictionContext } from "@/context/prediction";
import axios from "axios";
import { Pagination } from 'antd';
import SearchBar from "@/components/search-bar/search-bar";

interface ModelProps {
  cover_image_url: string;
  name: string;
  owner: string;
  createdAt: string;
  description: string;
}

const Page = () => {
  const [searchString, setSearchString] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const [loadedModules, setLoadedModules] = useState<any[]>([]);
  const [displayedModules, setDisplayedModules] = useState<any[]>([]);
  const [filteredModules, setFilteredModules] = useState<any[]>([]);

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

  const { setPrediction } = usePredictionContext();

  useEffect(() => {
    return () => {
      // Reset the prediction state when navigating away from this page
      setPrediction(null);
    };
  }, [setPrediction]);

  async function getData() {
    const response = await axios.get("http://65.108.226.61:8000/api/replicate/")

    setLoadedModules(response.data);
    updateDisplayedModules(response.data, currentPage);
  }

  useEffect(() => {

    getData()


  }, []);

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
    updateDisplayedModules(filteredModules, page)
  }

  const updateDisplayedModules = (modules: any[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedModules(modules.slice(startIndex, endIndex));
  };

  return (
    <>
      <main className="mt-[80px]">
        <div className="md:px-10 px-5">
          <SearchBar
            setSearchString={setSearchString}
            searchString={searchString}
          />
        </div>

        {displayedModules && displayedModules.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-y-10 gap-x-4 justify-between md:px-10 px-5">
              {displayedModules.map((model, idx) => (
                <ModelItem key={idx} cover_image_url={model.image_url}
                  name={model.name}
                  owner={model.owner}
                  github={model.github_url} />

              ))}
            </div>
            <div className="flex items-center my-[30px] ">
              <Pagination current={currentPage} total={filteredModules.length} defaultPageSize={26} showSizeChanger={false} onChange={handlePageChange} className="dark:text-white mx-auto" />
            </div>
          </>
        ) : (
          <span className="md:px-10 px-5 text-[26px]">No modules...</span>
        )}

      </main>


    </>
  );
}

export default Page