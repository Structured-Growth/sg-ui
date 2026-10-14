"use client";
import { useState } from "react";
import { Button } from "../../experimental/Button/Button";
import { Dialog } from "../../experimental/Dialog/Dialog";
import { TextField } from "../../experimental/TextField/TextField";
import { InsertContentMenuControl } from "./InsertContentMenuControl";

/** Bounded host fixture: requests are recorded, never applied to an editor. */
export function NativeInsertionHost() {
  const [owner, setOwner] = useState("Original host");
  const [available, setAvailable] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [dialog, setDialog] = useState<string | null>(null);
  const [requests, setRequests] = useState<string[]>([]);
  const [submits, setSubmits] = useState(0);
  const request = (command: string) => {
    setRequests(previous => [...previous, `${owner}: ${command}`]);
    if (command !== "Horizontal Rule") setDialog(command);
  };
  return <div onKeyDownCapture={event => {
    // Host shortcuts update props while the portaled menu retains native focus.
    if (event.key === "F2") { event.preventDefault(); setOwner("Replacement host"); }
    if (event.key === "F3") { event.preventDefault(); setAvailable(false); }
  }}>
    <p>F2 replaces the host callbacks; F3 makes Image and Columns Layout unavailable, including while the menu is open.</p>
    <Button onPress={() => setOwner("Replacement host")}>Replace host callbacks</Button>
    <Button onPress={() => setAvailable(false)}>Make dialog commands unavailable</Button>
    <Button onPress={() => setDisabled(value => !value)}>Toggle insertion disabled</Button>
    <form onSubmit={event => { event.preventDefault(); setSubmits(value => value + 1); }}>
      <InsertContentMenuControl disabled={disabled}
        onInsertImage={available ? () => request("Image") : undefined}
        onInsertHorizontalRule={() => request("Horizontal Rule")}
        onInsertColumnsLayout={available ? () => request("Columns Layout") : undefined} />
    </form>
    <p role="status" aria-label="Host insertion requests">{requests.join("; ") || "No insertion requests"}</p>
    <p role="status" aria-label="Host form submissions">{submits}</p>
    <p role="status" aria-label="Insertion callback owner">{owner}</p>
    <Dialog open={dialog !== null} title={dialog ? `Host ${dialog} insertion` : "Host insertion"}
      showCloseButton={false} onDismiss={() => setDialog(null)}
      footer={<Button onPress={() => setDialog(null)}>Finish host insertion</Button>}>
      <TextField label="Host insertion description" autoFocus />
    </Dialog>
  </div>;
}
