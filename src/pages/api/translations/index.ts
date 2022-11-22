import { prisma } from "@/server/db/client";
import type { NextApiRequest, NextApiResponse } from "next";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const payload = req.query as { key: string; code: string };

  const translation = await prisma.translation.findFirst({
    where: {
      source: {
        key: payload.key,
      },
      language: {
        code: payload.code,
      },
    },
  });

  if (!translation) {
    res.status(404).json({ message: "Not found" });
    return;
  }

  res.status(200).json(translation.text);
};

export default handler;
