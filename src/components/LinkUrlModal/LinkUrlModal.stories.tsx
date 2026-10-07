import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppButton } from "../AppButton";
import { Stack, Typography } from "../primitives";
import { LinkUrlModal } from "./LinkUrlModal";

const meta = {
  title: "Editors/LinkUrlModal",
  component: LinkUrlModal,
  tags: ["autodocs"],
  args: { open: false, onClose: () => {}, onSubmit: () => {} },
} satisfies Meta<typeof LinkUrlModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [lastDisplayText, setLastDisplayText] = useState("Example");
    const [lastValue, setLastValue] = useState<string | null>("https://example.com");
    const [session, setSession] = useState(0);

    return (
      <>
        <AppButton
          onPress={() => {
            setSession((current) => current + 1);
            setOpen(true);
          }}
          density="compact"
          variant="outlined"
        >
          Open Link Modal
        </AppButton>
        <LinkUrlModal
          initialDisplayText={lastDisplayText}
          key={session}
          initialUrl={lastValue ?? ""}
          onClose={() => setOpen(false)}
          onSubmit={({ displayText, url }) => {
            setLastDisplayText(displayText);
            setLastValue(url);
            setOpen(false);
          }}
          open={open}
        />
      </>
    );
  },
};

/** The host can narrow safe protocols; blank URL still removes an existing link. */
export const RestrictedProtocols: Story = {
  args: { open: true, initialDisplayText: "Course guide", initialUrl: "javascript:alert(1)", allowedProtocols: ["https"], allowRelativeUrls: false },
};

export const RemoveExistingLink: Story = {
  args: { open: true, initialDisplayText: "Keep this text", initialUrl: "" },
};

/** A local host owns its selected rich fragment and accepts edit/remove requests.
 * This is modal integration evidence, not a Lexical command implementation. */
export const NativeHostSelection: Story = {
  render: function NativeHostSelection() {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState<string | null>("https://example.org/original");
    const [events, setEvents] = useState<object[]>([]);
    const selection = useRef("");
    const fragment = useRef<HTMLElement>(null);
    const trigger = useRef<HTMLButtonElement>(null);
    const restorePending = useRef(false);
    const captureSelection = () => {
      const current = window.getSelection();
      if (current && fragment.current?.contains(current.anchorNode) && fragment.current.contains(current.focusNode)) {
        selection.current = current.toString();
      }
    };
    const restoreSelection = () => {
      if (!restorePending.current || document.activeElement !== trigger.current) return;
      restorePending.current = false;
      if (selection.current !== "Course guide" || !fragment.current) return;
      const range = document.createRange();
      range.selectNodeContents(fragment.current);
      const current = window.getSelection();
      current?.removeAllRanges();
      current?.addRange(range);
    };
    const richChildren = <><strong>Course</strong>{" "}<em>guide</em></>;
    return <Stack gap={3} onFocusCapture={event => {
      // The dialog owns return focus. Restore the host's selection only after
      // that native focus operation finishes, including when unlink replaced
      // the selected nodes. A submit-time RAF can run before dialog restoration.
      if (event.target === trigger.current && restorePending.current) queueMicrotask(restoreSelection);
    }}>
      <Typography variant="body2">Select the course guide text, then edit its link. The host retains the rich fragment.</Typography>
      <Typography ref={fragment} aria-label="Host rich fragment" onMouseUp={captureSelection}>
        {url ? <a href={url} onClick={event => event.preventDefault()}>{richChildren}</a> : richChildren}
      </Typography>
      <AppButton ref={trigger} variant="outlined" tone="neutral" onPress={() => {
        setEvents(current => [...current, { action: "open", selection: selection.current }]);
        setOpen(true);
      }}>Edit selected link</AppButton>
      <Typography as="div" variant="code" aria-label="Host link state">{JSON.stringify({ url, text: "Course guide" })}</Typography>
      <Typography as="div" variant="code" aria-label="Host link events">{JSON.stringify(events)}</Typography>
      <LinkUrlModal open={open} initialDisplayText="Course guide" initialUrl={url ?? ""}
        onClose={() => {
          setEvents(current => [...current, { action: "close", selection: selection.current }]);
          restorePending.current = true;
          setOpen(false);
        }}
        onSubmit={payload => {
          setEvents(current => [...current, { action: "submit", ...payload, selection: selection.current }]);
          restorePending.current = true;
          setUrl(payload.url);
          setOpen(false);
        }} />
    </Stack>;
  },
};
