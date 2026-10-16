from pathlib import Path
import difflib,json
root=Path.cwd(); out=root/'docs/developer/final-acceptance/wave-03-18'; proposed=out/'proposed-files'
files={}
p='packages/ui/src/experimental/TextArea/TextArea.tsx'; s=(root/p).read_text(); s=s.replace('forwardRef, useEffect, useImperativeHandle','forwardRef, useImperativeHandle'); s=s.replace('import type { TextFieldProps }', 'import { useStandaloneFormReset } from "../TextField/useStandaloneFormReset";\nimport type { TextFieldProps }'); s=s.replace('  const latest = useRef({ value, defaultValue });\n  latest.current = { value, defaultValue };\n','  const [preservedError, setPreservedError] = useState<string | undefined>();\n')
a=s.index('  useEffect(() => {'); b=s.index('  const control =',a)
s=s[:a]+'''  useStandaloneFormReset(inputRef, () => {
    if (value === undefined) setDraft(defaultValue ?? "");
    setPreservedError(undefined);
  }, () => {
    const message = inputRef.current?.getAttribute("aria-invalid") === "true" ? inputRef.current.validationMessage : "";
    return message ? () => setPreservedError(message) : undefined;
  });
'''+s[b:]; s=s.replace('      const next = event.currentTarget.value;','      const next = event.currentTarget.value;\n      setPreservedError(undefined);'); s=s.replace('isInvalid={invalid}', 'isInvalid={preservedError ? true : invalid}').replace('{errorMessage}</FieldError>', '{errorMessage ?? preservedError}</FieldError>'); files[p]=s
p='packages/ui/src/experimental/TextField/useStandaloneFormReset.ts'; files[p]=(root/p).read_text().replace('element instanceof HTMLInputElement ? element.form', '(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) ? element.form')
for p,s in files.items():
 dest=proposed/p; dest.parent.mkdir(parents=True,exist_ok=True); dest.write_text(s)
p='packages/ui/src/experimental/RadioGroup/RadioGroup.tsx'; s=(root/p).read_text().replace('useLayoutEffect, useRef,','useLayoutEffect, useRef, useState, useImperativeHandle,');s=s.replace('import styles from', 'import { useStandaloneFormReset } from "../TextField/useStandaloneFormReset";\nimport styles from')
s=s.replace('  const generatedName = useId();','''  const root = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => root.current!, []);
  const [internal, setInternal] = useState<string | null>(defaultValue ?? null);
  const [preservedError, setPreservedError] = useState<string | undefined>();
  const resetting = useStandaloneFormReset(root, () => {
    if (value === undefined) setInternal(defaultValue ?? null);
    setPreservedError(undefined);
  }, () => {
    const input = root.current?.querySelector<HTMLInputElement>('input:not(:disabled)');
    const message = root.current?.getAttribute("aria-invalid") === "true" ? input?.validationMessage : "";
    return message ? () => setPreservedError(message) : undefined;
  });
  const change = (next: string) => {
    if (resetting.current) return;
    setPreservedError(undefined);
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };
  const generatedName = useId();''').replace('ref={ref} value={value} defaultValue={defaultValue} onChange={onValueChange}', 'ref={root} value={value === undefined ? internal : value} onChange={change}').replace('isInvalid={invalid}','isInvalid={preservedError ? true : invalid}').replace('{errorMessage}</FieldError>', '{errorMessage ?? preservedError}</FieldError>')
files[p]=s
for p,s in files.items():
 dest=proposed/p; dest.parent.mkdir(parents=True,exist_ok=True); dest.write_text(s)
(out/'primitive-reset.patch').write_text(''.join(''.join(difflib.unified_diff((root/p).read_text().splitlines(True),s.splitlines(True),fromfile='a/'+p,tofile='b/'+p)) for p,s in files.items()))
