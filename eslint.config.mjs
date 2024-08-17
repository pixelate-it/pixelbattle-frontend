import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import preact from '@inthepocket/eslint-config-preact'

export default tseslint.config(
  eslint.configs.recommended,
  Array.from(preact),
  ...tseslint.configs.recommended
)
