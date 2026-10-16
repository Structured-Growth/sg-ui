'use client';
import {Button} from '@structured-growth/sg-ui/components/Button';
import {Box, Stack, Typography, Link} from '@structured-growth/sg-ui/primitives';
import {Progress, Surface, TextField} from '@structured-growth/sg-ui/experimental';
import {tokens} from '@structured-growth/sg-ui/tokens';
import {Example} from './Example';

const spacingSource = `import {Box, Stack, Typography} from '@structured-growth/sg-ui/primitives';
import {Surface} from '@structured-growth/sg-ui/experimental';
import {tokens} from '@structured-growth/sg-ui/tokens';

export function SpacingScale() {
  return <Stack gap={4}>
    {([1, 2, 3, 4] as const).map(step => <Surface key={step} variant="outlined" padding={step}>
      <Stack gap={step}>
        <Typography variant="code">{tokens[\`space\${step}\`]}</Typography>
        <Box aria-hidden="true" style={{inlineSize: tokens[\`space\${step}\`], blockSize: tokens.space4, background: tokens.action}} />
        <Typography>Padding and gap use the same production spacing step.</Typography>
      </Stack>
    </Surface>)}
  </Stack>;
}`;
function SpacingExample() {
  return <Example id="foundation-spacing" title="Production spacing scale" source={spacingSource}
    description="Spacing follows the shared rem-based production scale. Enlarge browser text to inspect how bars, padding and gaps grow together.">
    <Stack gap={4}>
      {([1, 2, 3, 4] as const).map(step => <Surface key={step} variant="outlined" padding={step}>
        <Stack gap={step}>
          <Typography variant="code">{tokens[`space${step}`]}</Typography>
          <Box aria-hidden="true" style={{inlineSize: tokens[`space${step}`], blockSize: tokens.space4, background: tokens.action}} />
          <Typography>Padding and gap use the same production spacing step.</Typography>
        </Stack>
      </Surface>)}
    </Stack>
  </Example>;
}
const focusSource = `import {Button} from '@structured-growth/sg-ui/components/Button';
import {Stack} from '@structured-growth/sg-ui/primitives';
import {TextField} from '@structured-growth/sg-ui/experimental';

export function FocusTraversal() {
  return <Stack direction="row" wrap gap={3} align="end">
    <Button>First focus target</Button>
    <Button disabled>Unavailable focus target</Button>
    <TextField label="Editable focus target" defaultValue="Course draft" />
    <Button variant="outlined" tone="neutral">Last focus target</Button>
  </Stack>;
}`;
function FocusExample() {
  return <Example id="foundation-focus" title="Keyboard focus traversal" source={focusSource}
    description="Use Tab and Shift+Tab through the three enabled controls. The disabled action is skipped. Focus styling comes from the production controls; test forced colors through your operating system as well.">
    <Stack direction="row" wrap gap={3} align="end">
      <Button>First focus target</Button>
      <Button disabled>Unavailable focus target</Button>
      <TextField label="Editable focus target" defaultValue="Course draft" />
      <Button variant="outlined" tone="neutral">Last focus target</Button>
    </Stack>
  </Example>;
}
const motionSource = `import {Button} from '@structured-growth/sg-ui/components/Button';
import {Stack} from '@structured-growth/sg-ui/primitives';
import {Progress} from '@structured-growth/sg-ui/experimental';

export function MotionPreferences() {
  return <Stack gap={3}>
    <Stack direction="row" wrap gap={3}>
      <Button>Hover or focus action</Button>
      <Button loading>Pending action</Button>
    </Stack>
    <Progress label="Indeterminate linear work" />
    <Progress label="Indeterminate circular work" variant="circular" />
    <Progress label="Determinate work" value={40} valueText="40 of 100" />
  </Stack>;
}`;
function MotionExample() {
  return <Example id="foundation-motion" title="Motion and system preferences" source={motionSource}
    description="Change your system reduced-motion preference while this panel is open. Production CSS removes transitions and indeterminate animation, while progress semantics and pending interaction remain. This sample shows host-supplied pending state; it performs no operation.">
    <Stack gap={3}>
      <Stack direction="row" wrap gap={3}>
        <Button>Hover or focus action</Button>
        <Button loading>Pending action</Button>
      </Stack>
      <Progress label="Indeterminate linear work" />
      <Progress label="Indeterminate circular work" variant="circular" />
      <Progress label="Determinate work" value={40} valueText="40 of 100" />
    </Stack>
  </Example>;
}
export function FoundationExamples() {
  return <Stack as="section" aria-label="Production foundation examples" gap={4}>
    <Typography as="h2" variant="h4">Production foundations</Typography>
    <Typography>These examples consume the library stylesheet and production token references. Each panel owns its controls. Appearance follows the preview preferences; spacing, focus and motion use the shipped contracts.</Typography>
    <Stack direction="row" wrap gap={3}>
      <Link href="#color-palettes">Palettes and semantic maps</Link>
      <Link href="/docs/components/typography">Typography roles</Link>
      <Link href="/docs/components/button">Control density comparisons</Link>
      <Link href="/docs/components/surface">Surface hierarchy</Link>
    </Stack>
    <SpacingExample /><FocusExample /><MotionExample />
  </Stack>;
}
