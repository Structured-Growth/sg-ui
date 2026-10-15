export default {
  experimental: { cpus: 2 },
  poweredByHeader: false,
  async redirects() {
    return ['installation', 'theming', 'releases', 'licensing'].map(page => ({
      source: `/docs/${page}`,
      destination: `/${page}`,
      permanent: true,
    }));
  },
};
