import { CreateSourceForm } from "@/components/sources";
import { TranslationsDataTable } from "@/components/sources/SourceDataTable";
import { BaseLayout } from "@/layouts/BaseLayout";
import { Button, Flex } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { type NextPage } from "next";
import Head from "next/head";
import { MdSearch, MdAdd } from "react-icons/md";

const Home: NextPage = () => {
  const modals = useModals();
  return (
    <BaseLayout
      topNavItems={[
        {
          icon: MdSearch,
          label: "Search",
        },
        {
          icon: MdAdd,
          label: "Create",
          onClick: () => {
            modals.openModal({
              title: "Create a source",
              children: <CreateSourceForm />,
              size: "lg",
            });
          },
        },
      ]}
    >
      <Head>
        <title>Translation Manager</title>
        <meta name="description" content="Translation management made simple" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex>
        <TranslationsDataTable />
      </Flex>
    </BaseLayout>
  );
};

export default Home;
