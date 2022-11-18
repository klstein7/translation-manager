import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

export const useSource = () => {
  const router = useRouter();
  const id = router.query.id as string;

  return trpc.sources.get.useQuery({ id });
};
