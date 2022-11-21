import { trpc } from "@/utils/trpc";

export const useUpdateTranslation = () => {
  const context = trpc.useContext();
  return trpc.translations.update.useMutation({
    onSuccess: ({ sourceId }) => {
      context.sources.get.invalidate({ id: sourceId });
    },
  });
};
