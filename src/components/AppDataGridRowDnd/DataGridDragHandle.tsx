import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import Box from "@mui/material/Box";
import type { DragEventHandler, MouseEventHandler } from "react";

export type DataGridDragHandleProps = {
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onDragStart?: DragEventHandler<HTMLDivElement>;
  onDragEnd?: DragEventHandler<HTMLDivElement>;
};

export function DataGridDragHandle({ className, onClick, onDragEnd, onDragStart }: DataGridDragHandleProps) {
  return (
    <Box
      className={className}
      draggable
      onClick={onClick}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      sx={{
        alignItems: "center",
        color: "text.disabled",
        cursor: "grab",
        display: "inline-flex",
        height: "100%",
        justifyContent: "center",
        minHeight: 0,
      }}
    >
      <DragIndicatorIcon fontSize="small" />
    </Box>
  );
}
