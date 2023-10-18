/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: '@eclipse-glsp',
    ignorePatterns: ['**/{node_modules,lib}', '**/.eslintrc.js', '**/webpack.config.js', '**/webpack.prod.js'],

    root: true,
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: 'tsconfig.eslint.json'
    }
};
