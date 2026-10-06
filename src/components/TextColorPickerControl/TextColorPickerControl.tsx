import {
  TextColorPickerControl as TextColorPickerControlImpl,
  type TextColorPickerControlProps,
} from "./TextColorPickerControl.impl";

export type { TextColorPickerControlProps };

export function TextColorPickerControl(props: TextColorPickerControlProps) {
  return TextColorPickerControlImpl(props);
}
