const CopyPlugin = require('copy-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

module.exports = {
    chainWebpack: config => {
        const svgRule = config.module.rule('svg')

        // If you don't do this, the loader below will be appended to existing loaders of the rule.
        svgRule.uses.clear();

        // Add replacement loader(s)
        svgRule.use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                extract: true,
                spriteFilename: './img/icons.svg',
                runtimeCompat: true
            })
    },

    configureWebpack: {
        plugins: [
            new CopyPlugin({
                patterns: [
                    {
                        from: 'extension',
                        to: '.'
                    }
                ]
            }),
            new SpriteLoaderPlugin({
                plainSprite: true
            })
        ]
    }
};
