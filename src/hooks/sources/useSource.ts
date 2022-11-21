import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

export const useSource = () => {
  const router = useRouter();
  const id = router.query.id;

  return trpc.sources.get.useQuery({ id: id as string }, { enabled: !!id });
};
