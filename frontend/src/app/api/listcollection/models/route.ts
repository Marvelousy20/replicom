import { NextResponse } from "next/server";
import axios from "axios";
import { type NextRequest } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import { url } from "inspector";

export async function GET(request: NextRequest) {
    // Extract owner and name from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get("slug");
    console.log(slug, "-----------------slug---------------")
    // Check if owner and name are provided
    if (!slug) {
        return new NextResponse(
            JSON.stringify({ error: "Slug parameters are required" }),
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
            `https://api.replicate.com/v1/collections/${slug}`,
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