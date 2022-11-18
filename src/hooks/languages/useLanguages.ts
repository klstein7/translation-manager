import { trpc } from "@/utils/trpc";

export const useLanguages = () => trpc.languages.find.useQuery();
