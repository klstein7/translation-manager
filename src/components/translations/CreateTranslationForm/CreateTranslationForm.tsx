import { CreateLanguageForm } from "@/components/languages";
import { useLanguages } from "@/hooks";
import { CreateTranslationSchema } from "@/schema";
import {
  Stack,
  Group,
  Select,
  Loader,
  Button,
  Textarea,
  Text,
  useMantineTheme,
  Box,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { MdAdd } from "react-icons/md";
import type { z } from "zod";

const CreateTranslationSchemaWithoutSource = CreateTranslationSchema.omit({
  sourceId: true,
});

export type CreateTranslationFormProps = {
  existingLanguages: string[];
  onSubmit?: (
    values: z.infer<typeof CreateTranslationSchemaWithoutSource>
  ) => void | Promise<void>;
  onCancel?: () => void;
};

export const CreateTranslationForm = ({
  existingLanguages,
  onSubmit,
  onCancel,
}: CreateTranslationFormProps) => {
  const [showLanguageForm, setShowLanguageForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const theme = useMantineTheme();
  const languages = useLanguages();

  const form = useForm<z.infer<typeof CreateTranslationSchemaWithoutSource>>({
    validate: zodResolver(CreateTranslationSchemaWithoutSource),
  });

  const languageSelectItems = useMemo(() => {
    const out =
      languages.data?.map((language) => ({
        label: `${language.name} (${language.code})`,
        value: language.id,
      })) ?? [];
    return out.filter((l) => {
      return !existingLanguages.includes(l.value);
    });
  }, [existingLanguages, languages.data]);

  return (
    <Stack
      align="stretch"
      p="sm"
      sx={{
        backgroundColor: theme.white,
        borderRadius: theme.radius.sm,
      }}
    >
      <Text size="sm">Add a new translation</Text>
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
          {...form.getInputProps("languageId")}
        />
        {!showLanguageForm && !form.values.languageId && (
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
        {...form.getInputProps("text")}
      />
      <Group position="right" align="center">
        {onCancel && (
          <Button size="xs" variant="subtle" color="gray" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          size="xs"
          loading={loading}
          onClick={async () => {
            form.validate();
            if (form.isValid()) {
              setLoading(true);
              await onSubmit?.(form.values);
              form.setValues({
                languageId: "",
                text: "",
              });
              setLoading(false);
            }
          }}
        >
          Add
        </Button>
      </Group>
    </Stack>
  );
};
