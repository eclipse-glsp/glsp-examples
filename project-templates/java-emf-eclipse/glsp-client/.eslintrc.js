/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: '@eclipse-glsp',
    root: true,
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: 'tsconfig.eslint.json'
    }
};
