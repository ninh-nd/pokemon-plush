import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "../prisma";
export const commentRouter = router({
  list: publicProcedure
    .input(z.object({ pokemonPlushId: z.string() }))
    .query(async ({ input }) => {
      const comments = await prisma.comment.findMany({
        where: {
          pokemonPlushId: input.pokemonPlushId,
        },
      });
      return comments;
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        comment: z.string(),
        star: z.number(),
        pokemonPlushId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const newComment = await prisma.comment.create({
        data: {
          pokemonPlushId: input.pokemonPlushId,
          name: input.name,
          comment: input.comment,
          star: input.star,
        },
      });
      return newComment;
    }),
});
