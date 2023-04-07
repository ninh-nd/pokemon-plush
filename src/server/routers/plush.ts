import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "../prisma";
export const plushRouter = router({
  list: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      if (!input.name) return null;
      const plushes = await prisma.pokemonPlush.findMany({
        where: {
          OR: [
            {
              name: {
                contains: input.name,
                mode: "insensitive",
              },
            },
            {
              plushName: {
                contains: input.name,
                mode: "insensitive",
              },
            },
          ],
        },
      });
      return plushes;
    }),
  listFirst: publicProcedure.query(async () => {
    const plush = await prisma.pokemonPlush.findFirst({});
    if (!plush) return [];
    return [plush];
  }),
});
