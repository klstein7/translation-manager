import { useDeleteSource, useDomains, useLanguages } from "@/hooks";
import {
  ActionIcon,
  Alert,
  Grid,
  Group,
  Highlight,
  Select,
  Spoiler,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import type { DataTableSortStatus } from "mantine-datatable";
import { DataTable } from "mantine-datatable";
import { useEffect, useMemo, useState } from "react";
import { MdArrowForward, MdDelete, MdSearch, MdWarning } from "react-icons/md";
import { matchSorter } from "match-sorter";
import { useRouter } from "next/router";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import sortBy from "lodash/sortBy";
import type { FindSourceOutput } from "@/utils/trpc";

const PAGE_SIZE = 15;

export type SourceDataTableProps = {
  sources: FindSourceOutput;
};

export const SourceDataTable = ({ sources }: SourceDataTableProps) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const modals = useModals();

  const [page, setPage] = useState(1);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "key",
    direction: "asc",
  });

  const [search, setSearch] = useState("");
  const [domainId, setDomainId] = useState<string | null>("");
  const [languageId, setLanguageId] = useState<string | null>("");

  const deleteSourceMutation = useDeleteSource();

  const domains = useDomains();
  const languages = useLanguages();

  const filteredSources = useMemo(() => {
    let out = sources;
    if (domainId) {
      out = out.filter((source) => source.domainId === domainId);
    }
    if (languageId) {
      out = out.filter((source) =>
        source.translations.some(
          (translation) => translation.languageId === languageId
        )
      );
    }
    if (search) {
      out = matchSorter(out, search.trim(), {
        keys: ["key", "domain.name", "text"],
      });
    }
    out = sortBy(out, sortStatus.columnAccessor);
    if (sortStatus.direction === "desc") {
      out = out.reverse();
    }
    return out;
  }, [
    sources,
    domainId,
    languageId,
    search,
    sortStatus.columnAccessor,
    sortStatus.direction,
  ]);

  const paginatedFilteredSources = useMemo(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    return filteredSources.slice(from, to);
  }, [filteredSources, page]);

  const domainSelectItems = useMemo(() => {
    return (
      domains.data?.map((domain) => ({
        label: domain.name,
        value: domain.id,
      })) ?? []
    );
  }, [domains.data]);

  const languageSelectItems = useMemo(() => {
    return (
      languages.data?.map((language) => ({
        label: language.name,
        value: language.id,
      })) ?? []
    );
  }, [languages.data]);

  const highlightThis = useMemo(() => {
    return search
      .trim()
      .split(" ")
      .filter((s) => s.length > 1);
  }, [search]);

  useEffect(() => {
    if (paginatedFilteredSources.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [paginatedFilteredSources, page]);

  return (
    <Stack align="stretch" sx={{ width: "100%" }}>
      <Grid>
        <Grid.Col sm={12} md={4}>
          <Select
            value={domainId}
            searchable
            clearable
            size="md"
            placeholder="Filter by domain..."
            sx={{ minWidth: 400 }}
            data={domainSelectItems}
            onChange={(value) => setDomainId(value)}
          />
        </Grid.Col>
        <Grid.Col sm={12} md={4}>
          <Select
            value={languageId}
            searchable
            clearable
            size="md"
            placeholder="Filter by language..."
            sx={{ minWidth: 400 }}
            data={languageSelectItems}
            onChange={(value) => setLanguageId(value)}
          />
        </Grid.Col>
      </Grid>
      <TextInput
        value={search}
        size="md"
        icon={<MdSearch size={20} />}
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />
      <DataTable
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        recordsPerPage={PAGE_SIZE}
        page={page}
        totalRecords={filteredSources.length}
        onPageChange={(p) => setPage(p)}
        withBorder={false}
        minHeight={200}
        borderRadius="sm"
        records={paginatedFilteredSources ?? []}
        striped
        withColumnBorders
        columns={[
          {
            accessor: "key",
            title: "Key",
            sortable: true,
            render: ({ key }) => {
              return <Highlight highlight={highlightThis}>{key}</Highlight>;
            },
          },
          {
            accessor: "domain.name",
            title: "Domain",
            sortable: true,
            render: ({ domain }) => {
              return (
                <Highlight highlight={highlightThis}>{domain.name}</Highlight>
              );
            },
          },
          {
            accessor: "text",
            title: "Source",
            sortable: true,
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
                    translations.length === 1 ? "translation" : "translations"
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
                    {translations.length === 0 && "-"}
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
                        size: "lg",
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
