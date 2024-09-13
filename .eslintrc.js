module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: [
    'airbnb-base',
    'prettier',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-plusplus': 0,
    'no-console': 'off',
    "import/prefer-default-export": "off",
    "no-use-before-define": ["error", {
      "functions": false,
    }],
    'prefer-template': 'off',
  },
};
