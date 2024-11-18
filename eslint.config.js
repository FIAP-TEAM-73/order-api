import love from 'eslint-config-love'

export default [
  {
    ...love,
    ignores: [
      'dist/**/*.ts',
      'dist/**',
      "**/*.mjs",
      "eslint.config.js",
      "**/*.js"
    ],
    rules: {
      "max-params": "warn"
    },
    files: ['**/*.js', '**/*.ts'],
  },
]