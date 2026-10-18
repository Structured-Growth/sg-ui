import { Button, Stack, Typography } from '@structured-growth/sg-ui/experimental';
import { CheckIcon } from '@structured-growth/sg-ui/icons';
import { ThemeScope } from '@structured-growth/sg-ui/theme';
import { resolveTheme } from '../../../theme';
import type { Meta, StoryObj } from '../../types';

const meta = { title: 'Acceptance/Validation contrast' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = { render: args => <Stack gap={4}>
  {(['material', 'apple'] as const).flatMap(identity => (['standard', 'increased'] as const).map(contrast =>
    <ThemeScope key={`${identity}-${contrast}`} theme="light" density="comfortable"
      data-testid={`${identity}-${contrast}`} style={{ ...resolveTheme(identity, 'light', contrast, args.forced === true),
        background: 'var(--sgui-validation-surface)', color: 'var(--sgui-text)', padding: 'var(--sgui-space4)' }}>
      <Stack direction="row" gap={2} align="center" style={{ color: 'var(--sgui-validation-success)' }}>
        <CheckIcon aria-hidden="true" />
        <Typography variant="body2" data-testid="success-message" style={{ color: 'inherit' }}>Validation succeeded. Your draft is ready.</Typography>
      </Stack>
      <Button variant="outlined" tone="neutral">Review draft</Button>
    </ThemeScope>))}
</Stack> };
