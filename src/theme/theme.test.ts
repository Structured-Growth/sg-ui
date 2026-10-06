import { describe, expect, it } from "vitest";
import { darkTheme, lightTheme, theme } from "./theme";

describe("theme", () => {
  it("uses light theme as default", () => {
    expect(theme).toBe(lightTheme);
    expect(lightTheme.palette.mode).toBe("light");
    expect(darkTheme.palette.mode).toBe("dark");
  });

  it("exposes typography and DataGrid defaults from the theme", () => {
    expect(lightTheme.typography.body2.fontSize).toBe("0.875rem");
    expect(lightTheme.components?.MuiButton?.defaultProps?.disableElevation).toBe(true);

    const dataGridRootOverride = (lightTheme.components?.MuiDataGrid?.styleOverrides as any)?.root;
    const styles = dataGridRootOverride({ theme: lightTheme });

    expect(styles["& .MuiDataGrid-cell"].fontSize).toBe(lightTheme.typography.body2.fontSize);
    expect(styles["& .MuiDataGrid-cellContent"].lineHeight).toBe(lightTheme.typography.body2.lineHeight);
  });
});
