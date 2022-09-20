import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";
import applyRateLimit from "../../../utils/apiLimit";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  /* Implement rate limit */
  await applyRateLimit(req, res);

  switch (method) {
    case "POST":
      await createNotes(req, res);
      break;
    default:
      res.status(405).json({ message: method + " method not allowed" });
  }
}

async function createNotes(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, content, password } = req.body;

    if (!title || !content)
      return res.status(400).json({ message: "Missing required fields" });

    const note = await prisma.note.create({
      data: {
        title,
        content,
        password,
      },
    });

    return res.status(201).json(note);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}