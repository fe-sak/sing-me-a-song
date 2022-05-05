import { Request, Response } from "express";
import { prisma } from "../database.js";

export async function clearRecommendations(_req: Request, res: Response) {
  await prisma.recommendation.deleteMany(); // TODO Ask mentor if it is needed to follow layered architecture for this line

  return res.sendStatus(200);
}
