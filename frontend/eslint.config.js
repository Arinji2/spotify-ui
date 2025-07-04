// @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

/** @type {import("eslint").Linter.Config} */
const customConfig = {
  rules: {
    'import/order': 'off',
  },
}

export default [...tanstackConfig, customConfig]
