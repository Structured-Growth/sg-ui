import Button, { type ButtonProps } from "@mui/material/Button";

export type AppButtonProps = ButtonProps;

export function AppButton({ variant = "contained", color = "primary", ...props }: AppButtonProps) {
  return <Button color={color} variant={variant} {...props} />;
}
