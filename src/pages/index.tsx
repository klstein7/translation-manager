import { TranslationsDataTable } from "@/components/sources/SourceDataTable";
import { BaseLayout } from "@/layouts/BaseLayout";
import { Button, Flex } from "@mantine/core";
import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <BaseLayout>
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
