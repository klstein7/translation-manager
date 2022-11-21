import { router } from "../trpc";
import { authRouter } from "./auth";
import { domainRouter } from "./domains";
import { languageRouter } from "./languages";
import { sourceRouter } from "./sources";
import { translationRouter } from "./translations";

export const appRouter = router({
  auth: authRouter,
  domains: domainRouter,
  languages: languageRouter,
  sources: sourceRouter,
  translations: translationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
