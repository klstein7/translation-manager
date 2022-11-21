import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { trpc } from "../utils/trpc";

import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          fontFamily: "Lexend, sans-serif",
          colorScheme: "light",
        }}
      >
        <ModalsProvider>
          <NotificationsProvider>
            <Component {...pageProps} />
          </NotificationsProvider>
        </ModalsProvider>
      </MantineProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
