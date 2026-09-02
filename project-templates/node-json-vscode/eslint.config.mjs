import glspConfig from '@eclipse-glsp/eslint-config';

export default [
    ...glspConfig,
    // Ignore JS/MJS/CJS config and build files
    { ignores: ['**/*.js', '**/*.mjs', '**/*.cjs'] },
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.eslint.json',
                tsconfigRootDir: import.meta.dirname
            }
        },
        rules: {
            // `svg`/`html` are imported for the JSX pragma and are never referenced directly
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'none',
                    caughtErrors: 'none',
                    varsIgnorePattern: 'svg|html'
                }
            ]
        }
    }
];
