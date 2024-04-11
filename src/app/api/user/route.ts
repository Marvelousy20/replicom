import { NextResponse } from "next/server";
import axios from "axios";
import { type NextRequest } from "next/server";

export async function GET(request:NextRequest, res:NextResponse) {
    const searchParams = request.nextUrl.searchParams;
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
        return new NextResponse(
            JSON.stringify({ error: "WalletAddress are required"}), 
            {
                status:400,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/registeruser/?walletAddress=${walletAddress}`);
        if (response.data.length == 0) {
            const res = await axios.post('http://127.0.0.1:8000/api/registeruser/', {walletAddress: `${walletAddress}`})
            const response = await axios.get(`http://127.0.0.1:8000/api/registeruser/?walletAddress=${walletAddress}`);
            console.log(JSON.stringify(response.data), "+response")
            return new NextResponse(JSON.stringify(response.data[0]));
        }
        console.log(response.data, "-response")
        return new NextResponse(JSON.stringify(response.data[0]));

    } catch(error) {
    
        return new NextResponse(
            JSON.stringify({
                error: "Failed to register"
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                  },
                }
        )
    }
    
    
}