import { router } from "../trpc";
import { authRouter } from "./auth";
import { domainRouter } from "./domains";
import { languageRouter } from "./languages";
import { sourceRouter } from "./sources";

export const appRouter = router({
  auth: authRouter,
  domains: domainRouter,
  languages: languageRouter,
  sources: sourceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
