module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-restricted-syntax': 0, // 禁止for in off
    'no-continue': 0, // 禁止使用continue.
    'no-plusplus': 0, // 关闭自增自减检测
    'no-console': 0, // 关闭控制台输出检测
    'max-len': 0, // 关闭单行长度最大100字符检测
    camelcase: 0, // 关闭强驼峰检测
    semi: ['error', 'always'], // 以分号结尾
    // 'comma-dangle': ['error', 'always'],
    'no-irregular-whitespace': 0, // 关闭不规则空格检测（全角）
    'consistent-return': 0, // 关闭方法后必须明确return检测
    'no-underscore-dangle': 0, // 关闭标识符不能以下划线开头或结尾检测
    'linebreak-style': [0, 'error', 'windows'], // 允许window开发环境
    'arrow-parens': 0, // 关闭箭头函数形参必须用括号包括检测
    'no-else-return': 0,
    'import/extensions': 'off', // 关闭强制后缀
    'no-param-reassign': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-dynamic-require': 0, // 不能使用动态require
    'import/no-unresolved': [2, { ignore: ['^@/'] }], // @ 是设置的路径别名\
    '@typescript-eslint/camelcase': ['off'],
  }
};
