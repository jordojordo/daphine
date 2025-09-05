import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default [
  { name: 'env', languageOptions: { globals: globals.node } },

  { name: 'ignores', ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    name:    'stylistic (JS+TS)',
    plugins: { '@stylistic': stylistic },
    rules:   {
      '@stylistic/indent':                ['warn', 2],
      '@stylistic/quotes':                ['warn', 'single', { avoidEscape: true, allowTemplateLiterals: 'always' }],
      '@stylistic/semi':                  ['warn', 'always'],
      '@stylistic/comma-dangle':          ['warn', 'only-multiline'],
      '@stylistic/function-call-spacing': ['warn', 'never'],
      '@stylistic/key-spacing':           ['warn', {
        align:     {
          beforeColon: false, afterColon: true, on: 'value', mode: 'minimum'
        },
        multiLine: { beforeColon: false, afterColon: true },
      }],
      '@stylistic/object-curly-spacing': ['warn', 'always'],
      '@stylistic/object-curly-newline': ['warn', {
        ObjectExpression:  { multiline: true, minProperties: 3 },
        ObjectPattern:     { multiline: true, minProperties: 4 },
        ImportDeclaration: { multiline: true, minProperties: 5 },
        ExportDeclaration: { multiline: true, minProperties: 3 },
      }],
      '@stylistic/arrow-spacing':                   ['warn', { before: true, after: true }],
      '@stylistic/brace-style':                     ['warn', '1tbs'],
      '@stylistic/block-spacing':                   ['warn', 'always'],
      '@stylistic/space-in-parens':                 ['warn', 'never'],
      '@stylistic/newline-per-chained-call':        ['warn', { ignoreChainWithDepth: 4 }],
      '@stylistic/multiline-ternary':               ['warn', 'never'],
      '@stylistic/padded-blocks':                   ['warn', 'never'],
      '@stylistic/padding-line-between-statements': ['warn',
        {
          blankLine: 'always', prev: '*', next: 'return'
        },
        {
          blankLine: 'always', prev: 'function', next: 'function'
        },
        // keep the “blank line after a declaration block, but not between consecutive declarations” pattern
        {
          blankLine: 'always', prev: ['const', 'let', 'var'], next: '*'
        },
        {
          blankLine: 'any',    prev: ['const', 'let', 'var'], next: ['const', 'let', 'var']
        },
      ],
      '@stylistic/template-curly-spacing':      ['warn', 'always'],
      '@stylistic/space-unary-ops':             ['warn', { words: true, nonwords: false }],
      '@stylistic/yield-star-spacing':          ['warn', 'both'],
      '@stylistic/lines-between-class-members': ['warn', 'always', { exceptAfterSingleLine: true }],
      '@stylistic/space-before-function-paren': ['warn', 'never'],
      '@stylistic/member-delimiter-style':      ['warn', {
        multiline:  { delimiter: 'semi', requireLast: true },
        singleline: { delimiter: 'semi', requireLast: false },
      }],
      '@stylistic/type-annotation-spacing': ['warn', {
        before: false, after: true, overrides: { arrow: { before: true, after: true } }
      }],

      'no-cond-assign': ['warn', 'except-parens'],
    },
  },

  {
    name:            'ts-parser',
    files:           ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser:        tseslint.parser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        projectService:  true,
        sourceType:      'module',
        ecmaVersion:     'latest',
      },
    },
  },
];
