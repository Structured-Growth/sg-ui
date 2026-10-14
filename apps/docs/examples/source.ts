export const literal = (value: string) => JSON.stringify(value);
/** Copyable component code assumes the application already owns its theme and stylesheet. */
export function exampleSource({ name, imports, state = '', body }: {
  name: string; imports: string[]; state?: string; body: string;
}) {
  const setup = [
    ...( /\buseState\b/.test(state + body) ? ["import { useState } from 'react';"] : []),
    ...( /<ThemeScope\b/.test(body) ? ["import { ThemeScope } from '@structured-growth/sg-ui/theme';"] : []),
    ...( /<Provider\b/.test(body) ? ["import { Provider } from '@structured-growth/sg-ui/theme';"] : []),
    ...imports,
  ];
  return `'use client';

${[...new Set(setup)].join('\n')}

export default function ${name}Example() {
${state ? state + '\n' : ''}  return (
    <>
${body.split('\n').map(line => '      ' + line).join('\n')}
    </>
  );
}
`;
}
