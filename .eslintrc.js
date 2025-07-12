module.exports = {
  extends: ['react-app'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
  overrides: [
    {
      files: ['public/sw.js'],
      env: {
        serviceworker: true,
      },
      globals: {
        self: 'readonly',
        clients: 'readonly',
        caches: 'readonly',
        fetch: 'readonly',
      },
    },
  ],
}; 