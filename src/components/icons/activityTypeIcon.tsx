import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ReactNode } from "react";

export const getActivityTypeIcon = (
  type: string | null | undefined,
  fontSize: SvgIconProps["fontSize"] = "small",
): ReactNode => {
  switch ((type ?? "").toLowerCase()) {
    case "lesson":
      return <MenuBookOutlinedIcon fontSize={fontSize} />;
    case "quiz":
    case "exam":
      return <QuizOutlinedIcon fontSize={fontSize} />;
    case "assignment":
    case "project":
      return <FactCheckOutlinedIcon fontSize={fontSize} />;
    case "lab":
    case "practice":
      return <ScienceOutlinedIcon fontSize={fontSize} />;
    default:
      return <WorkOutlineOutlinedIcon fontSize={fontSize} />;
  }
};
