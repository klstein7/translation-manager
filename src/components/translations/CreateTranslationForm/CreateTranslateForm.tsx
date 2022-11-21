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
    const getLanguage = (id: string) => {
      return languages.data?.find((language) => language.id === id);
    };
    let filtered =
      languages.data?.map((language) => ({
        label: `${language.name} (${language.code})`,
        value: language.id,
      })) ?? [];
    filtered = filtered.filter((language) => {
      return !form.values.translations.some(
        (translation) => translation.languageId === language.value
      );
    });
    if (form.values.translations[index]?.languageId) {
      const language = getLanguage(form.values.translations[index]!.languageId);
      if (language) {
        filtered.push({
          label: `${language.name} (${language.code})`,
          value: language.id,
        });
      }
    }
    return filtered;
  }, [form.values.translations, index, languages.data]);

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
        backgroundColor: theme.white,
        borderRadius: theme.radius.sm,
      }}
    >
      <Group position="apart">
        <Text size="sm">Create new translation</Text>
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
            color="blue"
            variant="subtle"
            leftIcon={<MdAdd />}
            sx={{ flex: 0 }}
            onClick={() => setShowLanguageForm(!showLanguageForm)}
          >
            New
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
              border: `1px solid ${theme.colors.gray[1]}`,
              backgroundColor: theme.white,
            }}
          >
            <Text size="xs" color="dimmed">
              Create new language
            </Text>
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
        label="Translation"
        description="The translated text"
        placeholder="e.g. Paiements Préautorisé"
        minRows={4}
        {...form.getInputProps(`translations.${index}.text`)}
      />
    </Stack>
  );
};
