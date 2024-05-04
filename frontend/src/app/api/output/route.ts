import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { type NextRequest, NextResponse } from "next/server";

require('dotenv').config();

export async function POST(request: Request, res: NextApiResponse) {
  const body = await request.json();
  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to make prediction" });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const predictionId = searchParams.get("id");
  const walletAddress = searchParams.get("walletAddress");

  if (!predictionId) {
    return new NextResponse(
      JSON.stringify({ error: "Prediction ID parameter is required" }),
      {
        status: 400, // Bad Request
        headers: {
          Authorization: `Token ${process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    // Make the request to the Replicate API for fetching the prediction result
    const response = await axios.get(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      {
        headers: {
          Authorization: `Token ${process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const predictionReplay = response.data;


    if (predictionReplay.status == "succeeded") {
      console.log(walletAddress, predictionReplay.model, predictionReplay.created_at, predictionReplay.metrics, predictionReplay, "----------scuee-lang")
      if (predictionReplay.metrics.predict_time == undefined) {
        console.log('---')
        const predictionSave = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/prediction/`, {
          walletAddress: `${walletAddress}`, status: 'succeeded', model: predictionReplay.model, created: predictionReplay.created_at,
          time: predictionReplay.metrics.output_token_count
        })
      }
      else {
        const predictionSave = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/prediction/`, {
          walletAddress: `${walletAddress}`, status: 'succeeded', model: predictionReplay.model, created: predictionReplay.created_at,
          time: predictionReplay.metrics.predict_time
        })
      }

    }
    if (predictionReplay.status == "failed") {
      const predictionSave = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/prediction/`, { walletAddress: `${walletAddress}`, status: 'failed', model: predictionReplay.model, created: predictionReplay.created_at, time: "0.0" })

    }
    // Return the response data
    return new NextResponse(JSON.stringify(response.data));
  } catch (error) {
    console.error(error);
    // Return an error response

    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch prediction result" }),
      {
        status: 500, // Internal Server Error
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
