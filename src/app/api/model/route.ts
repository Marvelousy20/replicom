import { NextResponse } from "next/server";
import axios from "axios";
import { type NextRequest } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import { url } from "inspector";

export async function GET(request: NextRequest) {
  // Extract owner and name from the query parameters
  const searchParams = request.nextUrl.searchParams;
  const owner = searchParams.get("owner");
  const name = searchParams.get("name");

  // Check if owner and name are provided
  if (!owner || !name) {
    return new NextResponse(
      JSON.stringify({ error: "Owner and name parameters are required" }),
      {
        status: 400, // Bad Request
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    // Make the request to the external API
    const response = await axios.get(
      `https://api.replicate.com/v1/models/${owner}/${name}`,
      {
        headers: {
          Authorization: `Token ${process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Return the response data
    return new NextResponse(JSON.stringify(response.data));
  } catch (error) {
    console.error(error);
    // Return an error response
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch model details" }),
      {
        status: 500, // Internal Server Error
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cancelUrl = searchParams.get("cancelUrl");

  console.log("cancelUrl", cancelUrl);
  if (cancelUrl) {
    try {
      const response = await fetch(cancelUrl, {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return Response.json(data);
      // return res.json(data);
    } catch (error) {
      console.error(error);
      return Response.json({
        error: "An error occurred while processing your request.",
        status: 500,
      });
    }
  } else {
    // Handle the case where cancelUrl is null
    console.error("cancelUrl is missing.");
    return new Response(
      JSON.stringify({
        error: "cancelUrl is missing.",
        status: 400,
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
