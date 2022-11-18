import { CreateDomainSchema } from "@/schema";
import { publicProcedure, router } from "../trpc";

export const domainRouter = router({
  find: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.domain.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }),
  create: publicProcedure
    .input(CreateDomainSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.domain.create({
        data: input,
      });
    }),
});
