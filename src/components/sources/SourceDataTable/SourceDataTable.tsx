import { useSources } from "@/hooks";
import {
  Highlight,
  LoadingOverlay,
  Spoiler,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { useMemo, useState } from "react";
import { MdSearch } from "react-icons/md";
import { matchSorter } from "match-sorter";

export const TranslationsDataTable = () => {
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
    <Stack align="stretch">
      <TextInput
        value={search}
        size="md"
        variant="filled"
        icon={<MdSearch size={20} />}
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />
      <DataTable
        withBorder
        borderRadius="sm"
        withColumnBorders
        striped
        highlightOnHover
        records={filteredSources}
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
        ]}
      />
    </Stack>
  );
};
