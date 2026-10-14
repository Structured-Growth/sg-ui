import presentation from './component-usage/presentation.json';
import forms from './component-usage/forms.json';
import editor from './component-usage/editor.json';
import data from './component-usage/data.json';

export interface ComponentUsageContent {
  when: string;
  how: string[];
  related?: {slug: string; label: string}[];
}

export const componentUsage: Record<string, ComponentUsageContent> = {
  ...presentation, ...forms, ...editor, ...data,
};
