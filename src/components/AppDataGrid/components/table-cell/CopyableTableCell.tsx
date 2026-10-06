import { useMemo } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useTranslation } from "../../../../i18n";
import { CellFallback } from "./CellFallback";

type CopyableTableCellProps = {
  value: unknown;
  fallbackText?: string;
};

export function CopyableTableCell({ value, fallbackText }: CopyableTableCellProps) {
  const textValue = useMemo(() => (value === null || value === undefined ? "" : String(value)), [value]);
  const { t, useNamespace } = useTranslation();
  useNamespace("common.ui");
  const tr = (key: string, defaultMessage: string) => t(key, { defaultMessage, namespace: "common.ui" });

  const handleCopy = async () => {
    if (!textValue) {
      return;
    }

    await navigator.clipboard.writeText(textValue);
  };

  return (
    <Box sx={{ alignItems: "center", display: "flex", gap: 0.75, height: "100%", minHeight: 0 }}>
      <Typography sx={{ maxWidth: 220 }} variant="bodyAlt2">
        <CellFallback fallbackText={fallbackText} value={textValue} />
      </Typography>
      <Tooltip title={tr("common.ui.common.copy", "Copy")}>
        <span>
          <IconButton disabled={!textValue} onClick={handleCopy} size="small">
            <ContentCopyIcon fontSize="inherit" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
}
