import { CreateLanguageSchema } from "@/schema";
import { publicProcedure, router } from "../trpc";

export const languageRouter = router({
  find: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.language.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }),
  create: publicProcedure
    .input(CreateLanguageSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.language.create({
        data: input,
      });
    }),
});
