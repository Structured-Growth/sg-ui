import {defineConfig,devices} from '@playwright/test';
import base from './playwright.config';
/** Bounded native scrollbar checks; keep the full catalog suite on Chromium. */
export default defineConfig({...base,testMatch:'scrollbar-layout.spec.ts',projects:[
  {name:'chromium',use:devices['Desktop Chrome']},
  {name:'firefox',use:devices['Desktop Firefox']},
  {name:'webkit',use:devices['Desktop Safari']},
]});
