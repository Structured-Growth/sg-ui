export default {
  experimental: { cpus: 2 },
  poweredByHeader: false,
  async redirects() {
    return [{source:'/docs/components/owned-button',destination:'/docs/components/button',permanent:true}, ...['installation', 'theming', 'releases', 'licensing'].map(page => ({
      source: `/docs/${page}`,
      destination: `/${page}`,
      permanent: true,
    }))];
  },
};
