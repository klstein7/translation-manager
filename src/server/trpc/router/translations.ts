import { UpdateTranslationSchema } from "@/schema";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const translationRouter = router({
  update: publicProcedure
    .input(UpdateTranslationSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.translation.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.translation.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
