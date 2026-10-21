import {fileURLToPath} from 'node:url';
import {DocsLicenseAuditPlugin} from './scripts/docs-license-audit.mjs';
import {isDocumentationReleaseVersion} from './content/documentation-versioning.mjs';
const staticExport = process.env.SGUI_DOCS_STATIC_EXPORT === '1';
const basePath = process.env.NEXT_PUBLIC_DOCS_BASE_PATH ?? '';
if (basePath && basePath!=='/dev' && !(basePath.startsWith('/releases/')&&!basePath.slice(10).startsWith('v')&&isDocumentationReleaseVersion(basePath.slice(10)))) {
  throw new Error('Docs base path must be /dev or an exact /releases/<version>');
}
export default {
  basePath,
  ...(staticExport ? {output:'export', trailingSlash:true, distDir:'.next-static'} : {}),
  experimental: { cpus: 2 },
  turbopack: {},
  poweredByHeader: false,
  webpack(config,{isServer}) {
    if(!isServer)config.plugins.push(new DocsLicenseAuditPlugin(fileURLToPath(new URL('../..',import.meta.url))));
    return config;
  },
  ...(!staticExport ? {async redirects() {
    return [{source:'/docs/components/owned-button',destination:'/docs/components/button',permanent:true}, ...['installation', 'theming', 'releases', 'licensing'].map(page => ({
      source: `/docs/${page}`,
      destination: `/${page}`,
      permanent: true,
    }))];
  }} : {}),
};
