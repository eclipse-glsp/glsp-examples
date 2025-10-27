/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    extends: '@eclipse-glsp',
    ignorePatterns: ['**/{node_modules,lib}', '**/.eslintrc.js', '**/scripts/*.ts'],

    parserOptions: {
        tsconfigRootDir: __dirname,
        project: 'tsconfig.eslint.json'
    },
    rules: {
        'no-restricted-imports': [
            'warn',
            {
                name: 'sprotty',
                message: "The sprotty default exports are customized and reexported by GLSP. Please use '@eclipse-glsp/client' instead"
            },
            {
                name: 'sprotty-protocol',
                message:
                    "The sprotty-protocol default exports are customized and reexported by GLSP. Please use '@eclipse-glsp/client' instead"
            }
        ]
    }
};
