import type { MouseEvent, ReactNode } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { AppButton } from "../AppButton";
import { EditableTitleField } from "../EditableTitleField";

export type ContentEditorChromeMenuItem = {
  id: string;
  label: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

export type ContentEditorChromeProps = {
  icon: ReactNode;
  title: string;
  onTitleSave: (nextTitle: string) => Promise<void> | void;
  menuItems: ContentEditorChromeMenuItem[];
  rightSlot?: ReactNode;
};

export function ContentEditorChrome({
  icon,
  title,
  onTitleSave,
  menuItems,
  rightSlot,
}: ContentEditorChromeProps) {
  return (
    <Box sx={{ bgcolor: "grey.100", borderBottom: 1, borderColor: "divider", flexShrink: 0, px: 2, py: 1.5 }}>
      <Stack alignItems="stretch" direction="row" spacing={1.5}>
        <Box
          sx={{
            alignItems: "center",
            color: "primary.main",
            display: "flex",
            lineHeight: 1,
            minWidth: 44,
            pt: 0.25,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
            <EditableTitleField minWidth={320} onSave={onTitleSave} title={title} variant="h4" />
            {rightSlot}
          </Stack>

          <Stack alignItems="center" direction="row" spacing={0.25} sx={{ color: "text.primary", mt: 0.5 }}>
            {menuItems.map((item) => (
              <AppButton
                color="inherit"
                key={item.id}
                onClick={(event) => item.onClick(event)}
                size="small"
                sx={{ minWidth: 0, px: 0.75, py: 0.125 }}
                variant="text"
              >
                {item.label}
              </AppButton>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
