import { useMemo, useState } from "react";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AppButton } from "../AppButton";
import { AppModal } from "../AppModal";

export type ExperiencePageNavigatorItem = {
  key: string;
  title: string;
};

export type ExperiencePageNavigatorProps = {
  pages: ExperiencePageNavigatorItem[];
  activePageKey: string | null;
  onSelectPage: (pageKey: string) => void;
  onAddPage: () => void;
  onRemovePage: (pageKey: string) => void;
  onRenamePage: (pageKey: string, title: string) => void;
  onReorderPages: (sourceKey: string, targetKey: string) => void;
  title?: string;
  readOnly?: boolean;
};

export function ExperiencePageNavigator({
  pages,
  activePageKey,
  onSelectPage,
  onAddPage,
  onRemovePage,
  onRenamePage,
  onReorderPages,
  title = "Pages",
  readOnly = false,
}: ExperiencePageNavigatorProps) {
  const [editingPageKey, setEditingPageKey] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [menuPageKey, setMenuPageKey] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [renameModalOpen, setRenameModalOpen] = useState(false);

  const activeIndex = useMemo(() => pages.findIndex((page) => page.key === activePageKey), [activePageKey, pages]);

  return (
    <Box sx={{ borderRight: 1, borderColor: "divider", display: "flex", flexDirection: "column", height: "100%" }}>
      <Stack alignItems="center" direction="row" justifyContent="space-between" sx={{ px: 2, py: 1.5 }}>
        <Typography variant="body2">{title}</Typography>
        <AppButton disabled={readOnly} onClick={onAddPage} size="small" startIcon={<AddIcon fontSize="small" />} variant="outlined">
          Add
        </AppButton>
      </Stack>
      <Box sx={{ borderTop: 1, borderColor: "divider", flex: 1, minHeight: 0, overflowY: "auto" }}>
        <List dense disablePadding>
          {pages.map((page, index) => {
            const isActive = page.key === activePageKey;
            const isEditing = page.key === editingPageKey;

            return (
              <ListItemButton
                className="experience-page-row"
                key={page.key}
                draggable={!readOnly}
                onClick={() => onSelectPage(page.key)}
                onDragOver={(event) => {
                  if (readOnly) {
                    return;
                  }
                  event.preventDefault();
                }}
                onDragStart={(event) => {
                  if (readOnly) {
                    return;
                  }
                  event.dataTransfer.setData("text/page-key", page.key);
                }}
                onDrop={(event) => {
                  if (readOnly) {
                    return;
                  }
                  event.preventDefault();
                  const sourceKey = event.dataTransfer.getData("text/page-key");
                  if (sourceKey && sourceKey !== page.key) {
                    onReorderPages(sourceKey, page.key);
                  }
                }}
                selected={isActive}
                sx={{ alignItems: "center", gap: 1.25, px: 1.5, py: 1 }}
              >
                <DragIndicatorIcon color="disabled" fontSize="small" />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {isEditing ? (
                    <ListItemText
                      primary={page.title}
                      secondary={`Page ${index + 1}${activeIndex === index ? " • Active" : ""}`}
                    />
                  ) : (
                    <ListItemText
                      primary={page.title}
                      secondary={`Page ${index + 1}${activeIndex === index ? " • Active" : ""}`}
                    />
                  )}
                </Box>
                <IconButton
                  aria-label={`Actions for ${page.title}`}
                  disabled={readOnly}
                  onClick={(event) => {
                    event.stopPropagation();
                    setMenuPageKey(page.key);
                    setMenuAnchorEl(event.currentTarget);
                  }}
                  size="small"
                  sx={{
                    opacity: 0,
                    ".experience-page-row:hover &, .experience-page-row:focus-within &": { opacity: 1 },
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </ListItemButton>
            );
          })}
        </List>
      </Box>
      <Menu
        anchorEl={menuAnchorEl}
        onClose={() => {
          setMenuAnchorEl(null);
          setMenuPageKey(null);
        }}
        open={Boolean(menuAnchorEl && menuPageKey)}
      >
        <MenuItem
          disabled={readOnly || !menuPageKey}
          onClick={() => {
            const targetPage = pages.find((page) => page.key === menuPageKey);
            if (!targetPage) {
              setMenuAnchorEl(null);
              setMenuPageKey(null);
              return;
            }
            setEditingPageKey(targetPage.key);
            setEditingTitle(targetPage.title);
            setMenuAnchorEl(null);
            setMenuPageKey(null);
            setRenameModalOpen(true);
          }}
        >
          Edit Page Name
        </MenuItem>
        <MenuItem
          disabled={readOnly || pages.length <= 1 || !menuPageKey}
          onClick={() => {
            if (!menuPageKey) {
              return;
            }
            onRemovePage(menuPageKey);
            setMenuAnchorEl(null);
            setMenuPageKey(null);
          }}
        >
          Remove
        </MenuItem>
      </Menu>
      <AppModal
        onClose={() => {
          setRenameModalOpen(false);
          setEditingPageKey(null);
          setEditingTitle("");
        }}
        open={renameModalOpen}
        primaryAction={{
          label: "Save",
          onClick: () => {
            const pageKey = editingPageKey;
            const nextTitle = editingTitle.trim();
            const existing = pageKey ? pages.find((page) => page.key === pageKey) : null;
            if (pageKey && nextTitle && existing && nextTitle !== existing.title) {
              onRenamePage(pageKey, nextTitle);
            }
            setRenameModalOpen(false);
            setEditingPageKey(null);
            setEditingTitle("");
          },
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => {
            setRenameModalOpen(false);
            setEditingPageKey(null);
            setEditingTitle("");
          },
          variant: "outlined",
        }}
        title="Edit Page Name"
      >
        <TextField
          autoFocus
          fullWidth
          label="Page Name"
          onChange={(event) => setEditingTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              const pageKey = editingPageKey;
              const nextTitle = editingTitle.trim();
              const existing = pageKey ? pages.find((page) => page.key === pageKey) : null;
              if (pageKey && nextTitle && existing && nextTitle !== existing.title) {
                onRenamePage(pageKey, nextTitle);
              }
              setRenameModalOpen(false);
              setEditingPageKey(null);
              setEditingTitle("");
            }
          }}
          size="small"
          value={editingTitle}
        />
      </AppModal>
    </Box>
  );
}
