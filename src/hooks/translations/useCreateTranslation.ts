import { trpc } from "@/utils/trpc";

export const useCreateTranslation = () => {
  const context = trpc.useContext();
  return trpc.translations.create.useMutation({
    onSuccess: ({ sourceId }) => {
      context.sources.get.invalidate({ id: sourceId });
    },
  });
};
