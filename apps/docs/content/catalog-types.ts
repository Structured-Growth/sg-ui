import type { ComponentType } from 'react';
export interface CatalogEntry {
  slug: string;
  title: string;
  description: string;
  /** Public export names demonstrated by this page, including compound children. */
  exports: string[];
  /** User-approved single working example in place of prop controls. */
  exampleTitle?: string;
  Playground: ComponentType;
}
