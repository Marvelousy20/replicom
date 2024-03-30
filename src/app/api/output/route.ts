import axios from "axios";

import { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  console.log("Request received:", req.method, req.body);

  if (req.method === "POST") {
    try {
      const response = await axios.post(
        "https://api.replicate.com/v1/predictions",
        req.body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      res.status(200).json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to make prediction" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    console.log("Request received:", req.method, req.body);
    console.log("Method not allowed", req.method);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
