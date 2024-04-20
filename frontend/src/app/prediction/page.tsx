"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

type PredictionDataType = {
  model: string;
  time: string;
  status: string;
  created: string;
};

const Prediction = () => {
  let userDataString = null;
  if (typeof window !== "undefined") {
    userDataString = localStorage.getItem("userData");
  }
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const walletAddress = userData?.walletAddress;

  const [predictionData, setPredictionData] = useState<PredictionDataType[]>(
    []
  );

  async function getPredictionData() {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/prediction/?walletAddress=${walletAddress}`
    );
    setPredictionData(response.data);
  }

  useEffect(() => {
    getPredictionData();
  }, []);

  return (
    <div className="px-[30px] py-[20px] dark:bg-[#212324] dark:text-white mb-[10px] my-auto min-h-[860px]">
      <h1 className="text-[25px]">Recent predictions</h1>
      <table className="w-full mt-[20px] ">
        <thead>
          <tr className="border-b-[1px] border-gray-600">
            <th className="w-[25%] text-left p-[10px]">Model</th>
            <th className="w-[15%] text-left p-[10px]">Status</th>
            <th className="w-[25%] text-left p-[10px]">Run time</th>
            <th className="w-[25%] text-left p-[10px]">Created</th>
          </tr>
        </thead>
        <tbody>
          {predictionData.map((data, key) => (
            <tr className="border-b-[1px] border-gray-600" key={key}>
              <td className="p-[10px]">{data.model}</td>
              <td className="p-[10px]">
                {data.status == "canceled" && (
                  <div className="w-[100px] p-[5px] bg-gray-200 text-gray-600 border-[1px] border-gray-600">
                    {data.status}
                  </div>
                )}

                {data.status == "failed" && (
                  <div className="w-[100px] p-[5px] bg-red-200 text-red-600 border-[1px] border-red-600">
                    {data.status}
                  </div>
                )}

                {data.status == "succeeded" && (
                  <div className="w-[100px] p-[5px] bg-emerald-200 text-emerald-600 border-[1px] border-emerald-600">
                    {data.status}
                  </div>
                )}
              </td>
              <td className="p-[10px]">{data.time} seconds</td>
              <td className="p-[10px]">
                {moment(data.created).format("YYYY-MM-DD hh:mm:ss")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Prediction;
