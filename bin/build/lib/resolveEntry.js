const fs = require('fs')
const { resolveProjectPath } = require('../../lib/utils')

/**
 * Get Entry if
 * main.js
 * main.jsx
 * main.ts
 * main.tsx
 */
module.exports = () => {
  const supportEntrySuffixs = ['js', 'jsx', 'ts', 'tsx']

  // eslint-disable-next-line no-restricted-syntax
  for (const suffix of supportEntrySuffixs) {
    const path = resolveProjectPath(`src/main.${suffix}`)
    if (fs.existsSync(path)) {
      return path
    }
  }
}
