const CopyPlugin = require('copy-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

module.exports = {
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.svg$/,
                    use: [
                        {
                            loader: 'svg-sprite-loader',
                            options: {
                                extract: true,
                                spriteFilename: './img/icons.svg',
                                runtimeCompat: true
                            }
                        }
                    ]
                }
            ]
        },

        plugins: [
            new CopyPlugin([
                { from: 'extension', to: '.' }
            ]),
            new SpriteLoaderPlugin({
                plainSprite: true
            })
        ]
    }
};