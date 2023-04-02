// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getFirstPokemonPlush,
  getPokemonPlush,
} from "../../../prisma/pokemonPlush";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        const name = req.query.name;
        if (Array.isArray(name)) return res.json([]);
        if (name) {
          const query = name ?? "";
          const plushes = await getPokemonPlush(query);
          return res.json(plushes);
        } else {
          // Only return the first plush
          const plush = await getFirstPokemonPlush();
          return res.json([plush]);
        }
    }
  } catch (error) {
    // @ts-ignore
    return res.json({ ...error, message: error.message });
  }
}
