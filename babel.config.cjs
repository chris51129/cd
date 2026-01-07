/**
 * Babel Configuration for Jest
 * Enables JSX transformation and modern JS features
 */
module.exports = {
    presets: [
        ['@babel/preset-env', {
            targets: {
                node: 'current'
            }
        }],
        ['@babel/preset-react', {
            runtime: 'automatic'
        }]
    ]
};
