module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'comma-dangle': ['error', 'only-multiline'],
    'keyword-spacing': ['error', { 'overrides': {
      'if': { 'after': false },
      'for': { 'after': false },
      'while': { 'after': false }
    }}],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'semi': [2, 'always'],
    'space-before-function-paren': [2, 'never'],
  }
}
