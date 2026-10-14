import type { ComponentType } from 'react';
export interface CatalogEntry {
  slug: string;
  title: string;
  description: string;
  /** Public export names demonstrated by this page, including compound children. */
  exports: string[];
  Playground: ComponentType;
}
