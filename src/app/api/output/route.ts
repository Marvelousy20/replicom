// // Import necessary modules
// import { NextResponse } from "next/server";
import axios from "axios";
// import { type NextRequest } from "next/server";

// // Define the POST handler function
// export async function POST(request: NextRequest) {
//   // Parse the request body
//   const formData = await request.json();

//   // Check if formData is provided
//   if (!formData) {
//     return new NextResponse(
//       JSON.stringify({ error: "Form data is required" }),
//       {
//         status: 400, // Bad Request
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   }

//   try {
//     // Make the POST request to the external API
//     const response = await axios.post(
//       `https://api.replicate.com/v1/predictions`,
//       formData,
//       {
//         headers: {
//           Authorization: `Token ${process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     // Return the response data
//     return new NextResponse(JSON.stringify(response.data));
//   } catch (error) {
//     console.error(error);
//     // Return an error response
//     return new NextResponse(
//       JSON.stringify({ error: "Failed to make prediction" }),
//       {
//         status: 500, // Internal Server Error
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   }
// }

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const response = await axios.post(
        "https://api.replicate.com/v1/predictions",
        req.body,
        {
          headers: {
            "Content-Type": "application/json",
            // Add any other necessary headers here
          },
        }
      );
      res.status(200).json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to make prediction" });
    }
  } else {
    // Handle any other HTTP methods
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
