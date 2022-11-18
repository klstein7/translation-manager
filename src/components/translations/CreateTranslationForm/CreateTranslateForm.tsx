import { CreateLanguageForm } from "@/components/languages";
import { useFormContext } from "@/components/sources";
import { useLanguages } from "@/hooks";
import type { CreateTranslationSchema } from "@/schema";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Loader,
  Select,
  Stack,
  Textarea,
  useMantineTheme,
  Text,
} from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { MdDelete, MdAdd } from "react-icons/md";
import type { z } from "zod";

export type CreateTranslationFormProps = {
  translation: z.infer<typeof CreateTranslationSchema>;
  index: number;
};

export const CreateTranslationForm = ({
  translation,
  index,
}: CreateTranslationFormProps) => {
  const form = useFormContext();
  const languages = useLanguages();
  const theme = useMantineTheme();

  const [showLanguageForm, setShowLanguageForm] = useState(false);

  const languageSelectItems = useMemo(() => {
    return (
      languages.data?.map((language) => ({
        label: `${language.name} (${language.code})`,
        value: language.id,
      })) ?? []
    );
  }, [languages.data]);

  useEffect(() => {
    if (translation.languageId) {
      setShowLanguageForm(false);
    }
  }, [translation.languageId]);

  return (
    <Stack
      align="stretch"
      p="sm"
      sx={{
        backgroundColor: theme.fn.rgba(theme.colors.dark[9], 0.4),
        borderRadius: theme.radius.sm,
      }}
    >
      <Group position="apart">
        <Text size="sm">Create translation</Text>
        {(form.values.translations?.length ?? 0) > 1 && (
          <ActionIcon
            size="xs"
            onClick={() => form.removeListItem("translations", index)}
          >
            <MdDelete />
          </ActionIcon>
        )}
      </Group>
      <Group align="flex-end">
        <Select
          clearable
          searchable
          variant="filled"
          label="Language"
          description="The language this translation is for"
          placeholder="Select language..."
          data={languageSelectItems}
          sx={{ flex: 1 }}
          rightSection={
            languages.isLoading && <Loader size={20} color="blue" />
          }
          {...form.getInputProps(`translations.${index}.languageId`)}
        />
        {!showLanguageForm && !translation.languageId && (
          <Button
            color="gray"
            variant="subtle"
            leftIcon={<MdAdd />}
            sx={{ flex: 0 }}
            onClick={() => setShowLanguageForm(!showLanguageForm)}
          >
            Add
          </Button>
        )}
      </Group>
      <AnimatePresence>
        {showLanguageForm && (
          <Box
            p="md"
            component={motion.div}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            sx={{
              borderRadius: theme.radius.md,
              border: `1px solid ${theme.colors.dark[5]}`,
            }}
          >
            <CreateLanguageForm
              onCancel={() => setShowLanguageForm(false)}
              onSuccess={() => {
                setShowLanguageForm(false);
              }}
            />
          </Box>
        )}
      </AnimatePresence>
      <Textarea
        variant="filled"
        label="Translation"
        description="The translated text"
        placeholder="e.g. Paiements Préautorisé"
        minRows={4}
        {...form.getInputProps(`translations.${index}.text`)}
      />
    </Stack>
  );
};
