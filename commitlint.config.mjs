export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Either a ! marker or a BREAKING CHANGE footer is sufficient.
    'breaking-change-exclamation-mark': [0],
    'subject-case': [0],
  },
};
