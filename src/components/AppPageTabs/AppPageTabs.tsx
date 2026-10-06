import Link from "../../adapters/Link";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import type { ReactElement } from "react";

export type AppPageTabItem = {
  id: string;
  label: string;
  href: string;
  icon?: ReactElement;
  replace?: boolean;
};

export type AppPageTabsProps = {
  value: string;
  items: AppPageTabItem[];
  onChange?: (value: string) => void;
  density?: "default" | "comfortable" | "compact";
};

export function AppPageTabs({ value, items, onChange, density = "default" }: AppPageTabsProps) {
  const tabSx = density === "compact"
    ? {
        minHeight: 36,
        px: 1,
        py: 0,
        fontSize: 13,
        "& .MuiTab-iconWrapper": {
          mr: 0.75,
        },
      }
    : density === "comfortable"
      ? {
          minHeight: 48,
          px: 1.25,
          py: 0.25,
          fontSize: 14,
          "& .MuiTab-iconWrapper": {
            mr: 0.875,
          },
        }
      : undefined;

  return (
    <Box sx={{ bgcolor: "background.paper", borderBottom: 1, borderColor: "divider", px: 1.5 }}>
      <Tabs
        onChange={(_, nextValue: string) => {
          onChange?.(nextValue);
        }}
        sx={density === "compact" ? { minHeight: 36 } : density === "comfortable" ? { minHeight: 48 } : undefined}
        value={value}
      >
        {items.map((item) => (
          onChange ? (
            <Tab
              icon={item.icon}
              iconPosition="start"
              key={item.id}
              label={item.label}
              sx={tabSx}
              value={item.id}
            />
          ) : (
            <Tab
              component={Link}
              href={item.href}
              icon={item.icon}
              iconPosition="start"
              key={item.id}
              label={item.label}
              replace={item.replace}
              sx={tabSx}
              value={item.id}
            />
          )
        ))}
      </Tabs>
    </Box>
  );
}
