/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from "../trpc";
import { commentRouter } from "./comment";
import { plushRouter } from "./plush";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => "yay!"),
  comment: commentRouter,
  plush: plushRouter,
});

export type AppRouter = typeof appRouter;
