module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    semi: [1, 'never'],
    'no-console': 'off',
    'no-underscore-dangle': ['error', { allow: ['_id', 'another'] }],
  },
}
