import glspConfig from '@eclipse-glsp/eslint-config';

export default [
    ...glspConfig,
    // Ignore JS/MJS/CJS config and build files as well as the generated Theia app sources
    { ignores: ['**/*.js', '**/*.mjs', '**/*.cjs', '**/src-gen/'] },
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
