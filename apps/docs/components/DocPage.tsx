import { Stack, Typography } from '@structured-growth/sg-ui/primitives';
import styles from './docs.module.css';
export function DocPage({title, description, children}: {title:string; description:string; children:React.ReactNode;}) {
  return <Stack gap={4}><Stack gap={2}><Typography variant="overline" tone="primary">SGUI / Development</Typography><Typography as="h1" variant="h2">{title}</Typography><Typography variant="subtitle1" tone="muted">{description}</Typography></Stack>{children}</Stack>;
}
export function Code({children}: {children:string}) { return <Typography as="code" variant="code" className={styles.code}>{children}</Typography>; }
