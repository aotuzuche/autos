module.exports = {
  extends: ['airbnb-base', 'prettier'],
  rules: {
    semi: ['error', 'never'],
    'no-console': 'off',
    'no-param-reassign': 'off',
    'global-require': 'off',
    'import/no-dynamic-require': 'off',
    'object-curly-newline': 'off',
    'no-shadow': 'off',
    'prefer-promise-reject-errors': 'off',
    'consistent-return': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'operator-linebreak': ['error', 'after', { overrides: { '?': 'before', ':': 'before' } }],
  },
}
