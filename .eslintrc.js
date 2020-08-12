let withReact;

try {
    require.resolve('eslint-plugin-react');
    withReact = true;
} catch (e) {
    withReact = false;
}

const options = {
    root: true,
    env: {
        node: true,
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prefer-arrow', 'import'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
    ],
    rules: {
        'indent': ['error', 4],
        'operator-linebreak': ['error', 'before'],
        'yoda': ['error', 'never'],
        'object-curly-spacing': ['error', 'never'],
        'array-bracket-spacing': ['error', 'never'],
        'space-in-parens': ['error', 'never'],
        'computed-property-spacing': ['error', 'never'],
        '@typescript-eslint/array-type': [
            'error',
            {default: 'array-simple', readonly: 'array-simple'},
        ],
        '@typescript-eslint/type-annotation-spacing': [
            'error',
            {before: true, after: true},
        ],
        '@typescript-eslint/ban-ts-comment': ['error', {
            'ts-ignore': 'allow-with-description',
        }],
        'prefer-arrow/prefer-arrow-functions': [
            'error',
            {
                disallowPrototype: true,
                singleReturnOnly: false,
                classPropertiesAllowed: false,
            },
        ],
        'import/no-unresolved': ['error', {commonjs: true, amd: true}],
        'import/newline-after-import': ['error'],
        'import/order': ['error', {
            'newlines-between': 'never',
            'alphabetize': {order: 'asc', caseInsensitive: true},
        }],
    },
};

if (withReact) {
    options.env.browser = true;
    options.settings = {
        react: {
            version: 'detect',
        },
    };
    options.parserOptions = {
        ecmaFeatures: {
            jsx: true,
        },
    };
    options.extends.push('plugin:react/recommended');
    options.rules['react/no-unescaped-entities'] = ['error', {forbid: ['>', '}']}];
    options.rules['react/jsx-tag-spacing'] = [
        'error',
        {
            beforeSelfClosing: 'never',
            beforeClosing: 'never',
        },
    ];
}

module.exports = options;
