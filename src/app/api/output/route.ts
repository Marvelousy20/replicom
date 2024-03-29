import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    // Assuming the request body contains the form data
    const formData = new FormData(request.body);

    // Convert FormData to JSON if needed for the API
    // Note: This step is optional and depends on the API's requirements
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    const response = await axios.post(
      "https://api.replicate.com/v1/predictions",
      data,
      {
        headers: {
          Authorization: `Token ${process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response);
    return new NextResponse(JSON.stringify(response.data));
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to submit prediction" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
