import type { IconType } from "react-icons";
import {
  Box,
  Center,
  Drawer,
  Stack,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { motion } from "framer-motion";
import { useState } from "react";
import { MdHome } from "react-icons/md";
import { useRouter } from "next/router";

export type SidebarProps = {
  brandLogo: IconType;
  brandLogoTooltip?: string;
  topNavItems?: SidebarItemProps[];
};

export const Sidebar = ({
  brandLogo: BrandLogo,
  brandLogoTooltip,
  topNavItems,
}: SidebarProps) => {
  const router = useRouter();
  const theme = useMantineTheme();

  return (
    <Stack
      py="xl"
      align="center"
      justify="space-between"
      sx={{
        width: 50,
        color: theme.colors.indigo[0],
        backgroundImage: theme.fn.gradient({
          from: theme.colors.indigo[9],
          to: theme.colors.blue[8],
        }),
      }}
    >
      <Stack align="center" sx={{ width: "100%" }}>
        <Tooltip
          withArrow
          color="indigo"
          label={brandLogoTooltip}
          position="right"
        >
          <Center sx={{ width: "100%" }}>
            <BrandLogo size={30} />
          </Center>
        </Tooltip>
        <Stack sx={{ width: "100%" }} spacing={0}>
          {topNavItems?.map((item, index) => (
            <SidebarItem key={`top-nav-${index}`} {...item} />
          ))}
        </Stack>
      </Stack>
      <Stack sx={{ width: "100%" }}>
        <SidebarItem
          icon={MdHome}
          label="Dashboard"
          onClick={() => {
            router.push("/");
          }}
        />
      </Stack>
    </Stack>
  );
};

export type SidebarItemProps = {
  icon: IconType;
  label: string;
  active?: boolean;
  onClick?: () => void | Promise<void>;
};

export const SidebarItem = ({
  icon: Icon,
  label,
  active,
  onClick,
}: SidebarItemProps) => {
  const theme = useMantineTheme();
  return (
    <Tooltip withArrow color="indigo" label={label} position="right">
      <Center
        component={motion.div}
        py="xs"
        sx={{
          width: "100%",
        }}
        whileHover={{
          cursor: "pointer",
          backgroundColor: theme.fn.rgba(theme.colors.blue[0], 0.1),
          transition: {
            duration: 0.1,
          },
        }}
        whileTap={{
          backgroundColor: theme.fn.rgba(theme.colors.blue[0], 0.25),
          transition: {
            duration: 0.1,
          },
        }}
        onClick={onClick}
      >
        <Icon size={23} />
      </Center>
    </Tooltip>
  );
};
