module.exports = {
  env: {
    browser: true,
    es2022: true,
    node: true,
    worker: true
  },
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['html'],
  rules: {
    semi: [2, 'always'],
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
    'space-before-function-paren': ['warn', 'never'],
    'no-unused-vars': ['warn', { ignoreRestSiblings: true, argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-unused-expressions': 0,
    'padded-blocks': 'off'
  }
};
