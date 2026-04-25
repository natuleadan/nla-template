import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'node_modules/**',
    '_deprecated/**',
  ]),
  {
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])

export default eslintConfig