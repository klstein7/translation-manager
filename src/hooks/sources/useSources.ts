import { trpc } from "@/utils/trpc";

export const useSources = () => trpc.sources.find.useQuery();
