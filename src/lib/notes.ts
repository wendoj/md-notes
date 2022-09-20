import { prisma } from "../server/db/client";

async function getNotes() {
  try {
    return await prisma.note.findMany();
  } catch (error: any) {
    return { error: error.message };
  }
}

async function getNote(id: any) {
  try {
    const note = await prisma.note.findUnique({
      where: {
        id,
      },
    });
    if (!note) return { message: "Note not found" };

    return note;
  } catch (error: any) {
    return { error: error.message };
  }
}

export { getNotes, getNote };