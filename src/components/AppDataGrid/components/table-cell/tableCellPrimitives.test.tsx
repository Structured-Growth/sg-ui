import { describe, expect, it } from "vitest";
import { CellFallback } from "./CellFallback";
import { CustomTableCell } from "./CustomTableCell";
import { DateTableCell } from "./DateTableCell";
import { DateTimeTableCell } from "./DateTimeTableCell";
import { ImageTableCell } from "./ImageTableCell";
import { JsonTableCell } from "./JsonTableCell";
import { TableCellLink } from "./TableCellLink";
import { TextTableCell } from "./TextTableCell";
import { TableLoaderOverlay } from "../TableLoaderOverlay";
import { TableNoResults } from "../TableNoResults";
import { DataGridDragHandle } from "../../../AppDataGridRowDnd/DataGridDragHandle";

describe("table cell primitives", () => {
  it("renders fallback content branches", () => {
    expect((CellFallback({ value: null }) as any).props.children).toBe("\u2014");
    expect((CellFallback({ value: "abc" }) as any).props.children).toBe("abc");
  });

  it("renders custom/date/dateTime/json/image/link variants", () => {
    expect((CustomTableCell({ children: "x" }) as any).props.children).toBe("x");

    const dateCell = DateTableCell({ value: "2026-02-01T00:00:00.000Z" }) as any;
    expect(dateCell.type).toBe(TextTableCell);
    expect(typeof dateCell.props.value).toBe("string");
    const dateCellFromDate = DateTableCell({ value: new Date("2026-02-01T00:00:00.000Z") }) as any;
    expect(dateCellFromDate.type).toBe(TextTableCell);
    expect(typeof dateCellFromDate.props.value).toBe("string");
    const dateCellFromNumber = DateTableCell({ value: 12345, fallbackText: "N/A" }) as any;
    expect(dateCellFromNumber.props.value).toBeNull();
    expect(dateCellFromNumber.props.fallbackText).toBe("N/A");
    const dateCellBad = DateTableCell({ value: "invalid", fallbackText: "N/A" }) as any;
    expect(dateCellBad.props.value).toBeNull();
    expect(dateCellBad.props.fallbackText).toBe("N/A");

    const dateTimeCell = DateTimeTableCell({ value: "2026-02-01T00:00:00.000Z" }) as any;
    expect(dateTimeCell.type).toBe(TextTableCell);
    expect(typeof dateTimeCell.props.value).toBe("string");
    const dateTimeFromDate = DateTimeTableCell({ value: new Date("2026-02-01T00:00:00.000Z") }) as any;
    expect(dateTimeFromDate.type).toBe(TextTableCell);
    expect(typeof dateTimeFromDate.props.value).toBe("string");
    const dateTimeFromNumber = DateTimeTableCell({ value: 12345, fallbackText: "missing" }) as any;
    expect(dateTimeFromNumber.props.value).toBeNull();
    expect(dateTimeFromNumber.props.fallbackText).toBe("missing");

    const jsonCell = JsonTableCell({ value: { a: 1 } }) as any;
    expect(jsonCell.type).toBe(TextTableCell);
    expect(jsonCell.props.title).toBe('{"a":1}');
    expect(jsonCell.props.truncate).toBe(true);
    const jsonCellNull = JsonTableCell({ value: null, fallbackText: "missing" }) as any;
    expect(jsonCellNull.props.value).toBeNull();
    expect(jsonCellNull.props.fallbackText).toBe("missing");

    const imageWithSrc = ImageTableCell({ src: "https://example.com/a.png", alt: "Avatar" }) as any;
    expect(imageWithSrc.props.children.props.src).toBe("https://example.com/a.png");
    const imageWithoutSrc = ImageTableCell({ src: null }) as any;
    expect(imageWithoutSrc.props.children.type).toBeDefined();
    const imageDefaultAlt = ImageTableCell({ src: "https://example.com/b.png" }) as any;
    expect(imageDefaultAlt.props.children.props.alt).toBe("Row image");

    const linkWithLabel = TableCellLink({ href: "/x", label: "Open", abbr: "AB" }) as any;
    const linkChildren = (linkWithLabel.props.children as any[])[1];
    expect(linkChildren.props.href).toBe("/x");
    expect(linkChildren.props.children.props.variant).toBe("bodyAlt2");
    const linkWithoutLabel = TableCellLink({ href: "/x" }) as any;
    const linkWithoutLabelContent = (linkWithoutLabel.props.children as any[])[1].props.children as any;
    expect(linkWithoutLabelContent.props.variant).toBe("bodyAlt2");

    const textCell = TextTableCell({ value: "Simple text" }) as any;
    expect(textCell.props.children.props.variant).toBe("bodyAlt2");
    const textFallbackCell = TextTableCell({ value: "", fallbackText: "No value" }) as any;
    expect(textFallbackCell.props.children.props.children).toBe("No value");
  });

  it("renders loader/no-results and drag-handle props", () => {
    const loader = TableLoaderOverlay() as any;
    expect(loader.props.children.props.size).toBe(26);

    const noResults = TableNoResults() as any;
    expect(noResults.props.children.props.children).toBe("No results found");

    const handle = DataGridDragHandle({ className: "drag-handle" }) as any;
    expect(handle.props.draggable).toBe(true);
    expect(handle.props.className).toBe("drag-handle");
  });
});
