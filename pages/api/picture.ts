import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { q } = req.query;

    if (!q) {
      res.status(400).json({ error: " city is required" });
      return;
    }

    try {
      console.log(process.env.PIXABAY_KEY, q);
      const response = await fetch(
        `https://pixabay.com/api/?key=${process.env.PIXABAY_KEY}&q=${q}&image_type=photo`
      );

      if (!response.ok) {
        res.status(response.status).json({ error: "Error fetching images" });
        return;
      }
      const data = await response.json();

      res.status(200).json(data.hits[0].largeImageURL);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
