import { trpc } from "@/utils/trpc";

export const useCreateLanguage = () => {
  const context = trpc.useContext();
  return trpc.languages.create.useMutation({
    onSuccess: () => {
      context.languages.find.invalidate();
    },
  });
};
