import { NextResponse } from "next/server";
import axios from "axios";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest, res: NextResponse) {
  const searchParams = request.nextUrl.searchParams;
  const walletAddress = searchParams.get("walletAddress");
  console.log(walletAddress, "wallet");

  if (!walletAddress) {
    return new NextResponse(
      JSON.stringify({ error: "WalletAddress are required" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/registeruser/?walletAddress=${walletAddress}`
    );
    console.log(response.data.length, response.data, "-response");
    if (response.data.length == 0) {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/registeruser/`,
        { walletAddress: `${walletAddress}` }
      );
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/registeruser/?walletAddress=${walletAddress}`
      );
      console.log(response.data, response.data.length, "+response");
      return new NextResponse(JSON.stringify(response.data[0]));
    }

    return new NextResponse(JSON.stringify(response.data[0]));
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: "Failed to register",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
