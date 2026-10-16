export default {
  esbuild: { jsx: "automatic" },
  resolve: { alias: [
    { find: /^react(?=\/|$)/, replacement: '/Users/thomashall/Repositories/sg-ui/packages/ui/node_modules/react' },
    { find: /^react-dom(?=\/|$)/, replacement: '/Users/thomashall/Repositories/sg-ui/packages/ui/node_modules/react-dom' },
    { find: /^@testing-library(?=\/)/, replacement: '/Users/thomashall/Repositories/sg-ui/packages/ui/node_modules/@testing-library' },
    { find: /^vitest$/, replacement: '/Users/thomashall/Repositories/sg-ui/packages/ui/node_modules/vitest/dist/index.js' }
  ] },
  test: { environment: "jsdom", include: ['/Users/thomashall/Repositories/sg-ui/docs/developer/final-acceptance/wave-03-03/public-contracts.runtime.test.tsx'], setupFiles: ["scripts/vitest.setup.ts"], maxWorkers: 1, fileParallelism: false, execArgv: ["--no-experimental-webstorage"] },
  cacheDir: '/Users/thomashall/Repositories/sg-ui/docs/developer/final-acceptance/wave-03-03/vite-cache'
};
