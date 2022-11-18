import { trpc } from "@/utils/trpc";

export const useDomains = () => trpc.domains.find.useQuery();
