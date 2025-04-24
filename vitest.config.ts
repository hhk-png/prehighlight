import { coverageConfigDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    extensions: ['.ts', '.d.ts', '.json', '.js'],
  },
  test: {
    pool: 'forks',
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      exclude: ['ui', ...coverageConfigDefaults.exclude],
    },
    include: ['./test/*.test.ts'],
  },
})
