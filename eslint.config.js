import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: {
                ...globals.browser
            }
        }
    },
    {
        files: ['app.config.{js,ts}'],
        languageOptions: {
            globals: {
                ...globals.node
            }
        }
    },

    js.configs.recommended,
    tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,

    {
        plugins: {
            'react-hooks': pluginReactHooks
        },
        rules: {
            indent: ['off', 4],
            'react/jsx-indent': [
                2,
                4,
                { indentLogicalExpressions: false }
            ],
            'react/jsx-indent-props': [2, 4],
            'react/prop-types': 'off',
            'react/jsx-filename-extension': [
                2,
                { extensions: ['.js', '.jsx', '.ts', '.tsx'] }
            ],
            'react/react-in-jsx-scope': 'off',
            'import/no-unresolved': 'off',
            'import/prefer-default-export': 'off',
            'no-unused-vars': 'off', // отключаем конфликт с ts
            '@typescript-eslint/no-unused-vars': 'warn',
            'react/jsx-props-no-spreading': 'off',
            'react/function-component-defenition': 'off',
            'import/extensions': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'error',
            'react/display-name': 'off'
        }
    },

    {
        settings: {
            react: {
                version: 'detect'
            }
        }
    },

    {
        files: ['config/jest/**/*.js', 'plopfile.js'],
        languageOptions: {
            globals: {
                ...globals.node
            }
        },
        rules: {
            'no-undef': 'off'
        }
    },

    {
        files: ['server/**/*.js'],
        languageOptions: {
            sourceType: 'commonjs',
            globals: {
                ...globals.node
            }
        },
        rules: {
            '@typescript-eslint/no-require-imports': 'off'
        }
    }
]);
