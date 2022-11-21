import { useDeleteSource, useSources } from "@/hooks";
import {
  ActionIcon,
  Alert,
  Group,
  Highlight,
  LoadingOverlay,
  Spoiler,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { useMemo, useState } from "react";
import { MdArrowForward, MdDelete, MdSearch, MdWarning } from "react-icons/md";
import { matchSorter } from "match-sorter";
import { useRouter } from "next/router";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

export const TranslationsDataTable = () => {
  const theme = useMantineTheme();

  const deleteSourceMutation = useDeleteSource();

  const router = useRouter();
  const modals = useModals();
  const [search, setSearch] = useState("");
  const sources = useSources();

  const filteredSources = useMemo(() => {
    let out = sources.data ?? [];
    if (search) {
      out = matchSorter(out, search.trim(), {
        keys: ["key", "domain.name", "text"],
      });
    }
    return out;
  }, [search, sources.data]);

  const highlightThis = useMemo(() => {
    return search
      .trim()
      .split(" ")
      .filter((s) => s.length > 1);
  }, [search]);

  if (sources.isLoading) {
    return <LoadingOverlay visible />;
  }

  return (
    <Stack align="stretch" sx={{ width: "100%" }}>
      <TextInput
        value={search}
        size="md"
        icon={<MdSearch size={20} />}
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />
      <DataTable
        withBorder={false}
        minHeight={200}
        borderRadius="sm"
        records={filteredSources ?? []}
        striped
        withColumnBorders
        columns={[
          {
            accessor: "key",
            title: "Key",
            render: ({ key }) => {
              return <Highlight highlight={highlightThis}>{key}</Highlight>;
            },
          },
          {
            accessor: "domain.name",
            title: "Domain",
            render: ({ domain }) => {
              return (
                <Highlight highlight={highlightThis}>{domain.name}</Highlight>
              );
            },
          },
          {
            accessor: "text",
            title: "Source",
            render: ({ text }) => {
              return <Highlight highlight={highlightThis}>{text}</Highlight>;
            },
          },
          {
            accessor: "translations",
            width: 400,
            render: ({ translations }) => {
              return (
                <Spoiler
                  maxHeight={1}
                  hideLabel="Hide"
                  showLabel={`${translations.length} ${
                    translations.length > 1 ? "translations" : "translation"
                  }`}
                  styles={{
                    control: {
                      color: theme.colors.indigo[6],
                    },
                  }}
                >
                  <Stack py="xs">
                    {translations.map((translation) => (
                      <Stack key={translation.id} spacing={5}>
                        <Text size="xs" weight="bold">
                          {translation.language.name} (
                          {translation.language.code})
                        </Text>
                        <Text size="xs">{translation.text}</Text>
                      </Stack>
                    ))}
                  </Stack>
                </Spoiler>
              );
            },
          },
          {
            accessor: "actions",
            title: "",
            width: 100,
            render: ({ id, key }) => {
              return (
                <Group align="center" spacing={5} position="center">
                  <ActionIcon
                    onClick={() => {
                      modals.openConfirmModal({
                        title: "Delete source",
                        labels: {
                          cancel: "Cancel",
                          confirm: "Delete",
                        },
                        confirmProps: {
                          color: "red",
                          leftIcon: <MdDelete />,
                          loading: deleteSourceMutation.isLoading,
                        },
                        onConfirm: async () => {
                          await deleteSourceMutation.mutateAsync({ id });
                          showNotification({
                            title: "Source deleted",
                            message: `Source "${key}" was deleted`,
                            color: "red",
                          });
                        },
                        children: (
                          <Alert
                            variant="outline"
                            icon={<MdWarning />}
                            color="red"
                            title="Are you sure?"
                          >
                            This will delete the source <b>{key}</b> and all
                            translations for it.{" "}
                            <b>This action cannot be undone.</b>
                          </Alert>
                        ),
                      });
                    }}
                  >
                    <MdDelete />
                  </ActionIcon>
                  <ActionIcon
                    onClick={() => {
                      router.push(`/s/${id}`);
                    }}
                  >
                    <MdArrowForward />
                  </ActionIcon>
                </Group>
              );
            },
          },
        ]}
      />
    </Stack>
  );
};
