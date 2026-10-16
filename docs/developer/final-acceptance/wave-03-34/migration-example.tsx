import { useRef } from "react";
import { Button, type ButtonProps } from "@structured-growth/sg-ui/components/Button";

export function SaveDraft({ onSave }: { onSave: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const variant: ButtonProps["variant"] = "outlined";
  return <Button ref={ref} variant={variant} tone="neutral"
    onPress={onSave}>{"Save draft"}</Button>;
}
