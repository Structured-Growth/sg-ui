import { createTheme, type PaletteMode, type ThemeOptions } from "@mui/material/styles";
import type {} from "@mui/x-data-grid/themeAugmentation";

const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: { main: "#1d4ed8" },
          secondary: { main: "#0f766e" },
          error: { main: "#b91c1c" },
          warning: { main: "#b45309" },
          info: { main: "#0369a1" },
          success: { main: "#15803d" },
          background: {
            default: "#f8fafc",
            paper: "#ffffff",
          },
          text: {
            primary: "#0f172a",
            secondary: "#334155",
          },
        }
      : {
          primary: { main: "#60a5fa" },
          secondary: { main: "#2dd4bf" },
          error: { main: "#f87171" },
          warning: { main: "#fbbf24" },
          info: { main: "#38bdf8" },
          success: { main: "#4ade80" },
          background: {
            default: "#0f172a",
            paper: "#111827",
          },
          text: {
            primary: "#e2e8f0",
            secondary: "#cbd5e1",
          },
        }),
  },
  typography: {
    fontFamily:
      '"Geist", "Geist Fallback", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontSize: "2.5rem", fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: "2rem", fontWeight: 700, lineHeight: 1.25 },
    h3: { fontSize: "1.75rem", fontWeight: 600, lineHeight: 1.3 },
    h4: { fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.35 },
    h5: { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.45 },
    body1: { fontSize: "1rem", lineHeight: 1.6 },
    body2: { fontSize: "0.875rem", lineHeight: 1.55 },
    bodyAlt2: { fontSize: "0.875rem", lineHeight: 1.45, fontWeight: 500 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 6,
  },
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  transitions: {
    duration: {
      shortest: 120,
      shorter: 180,
      short: 220,
      standard: 280,
      complex: 380,
      enteringScreen: 240,
      leavingScreen: 200,
    },
  },
  zIndex: {
    appBar: 1200,
    drawer: 1300,
    modal: 1400,
    snackbar: 1500,
    tooltip: 1600,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: "100vh",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 16,
          paddingBlock: 8,
          fontWeight: 600,
        },
        sizeSmall: {
          borderRadius: 5,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        sizeSmall: {
          borderRadius: 5,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        sizeSmall: {
          borderRadius: 5,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "small",
      },
    },
    MuiMenu: {
      defaultProps: {
        MenuListProps: {
          dense: true,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: 13,
          minHeight: 30,
          paddingLeft: 10,
          paddingRight: 10,
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        color: "transparent",
        elevation: 0,
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 48,
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: ({ theme }) => ({
          "& .MuiDataGrid-cell": {
            ...theme.typography.body2,
          },
          "& .MuiDataGrid-cellContent": {
            ...theme.typography.body2,
          },
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 48,
          "&.MuiTab-labelIcon": {
            minHeight: 48,
          },
        },
      },
    },
  },
});

export const lightTheme = createTheme(getDesignTokens("light"));
export const darkTheme = createTheme(getDesignTokens("dark"));
export const theme = lightTheme;
