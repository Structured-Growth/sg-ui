export default {
  branches: ['main'],
  tagFormat: 'v${version}',
  plugins: [
    ['@semantic-release/commit-analyzer', { preset: 'conventionalcommits' }],
    ['@semantic-release/release-notes-generator', { preset: 'conventionalcommits' }],
    ['@semantic-release/npm', { npmPublish: true, tarballDir: 'artifacts/release' }],
    ['@semantic-release/github', {
      assets: [{ path: 'artifacts/release/*.tgz', label: 'Structured Growth UI npm package' }],
      // Publishing does not post comments to issues or pull requests.
      successCommentCondition: false,
      failCommentCondition: false,
      releasedLabels: false,
      addReleases: false,
    }],
  ],
};
