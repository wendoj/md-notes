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

    // Generate ID and check if ID already exists
    const id = Math.random().toString(36).substr(2, 10);

    const exists = await prisma.note.findUnique({ where: { id } });
    if (exists)
      return res.status(500).json({ message: "Something went wrong" });

    const note = await prisma.note.create({
      data: {
        id,
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