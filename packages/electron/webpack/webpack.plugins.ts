import CopyWebpackPlugin from 'copy-webpack-plugin'
import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import path from 'path'
import type { WebpackPluginInstance } from 'webpack'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

export const plugins: (false | WebpackPluginInstance)[] = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        // Copy ../../frontend/resources/assets to ./webpack/renderer/assets for static folder
        from: path.resolve(__dirname, '..', '..', 'frontend', 'resources', 'assets'),
        to: path.resolve(__dirname, '..', '.webpack', 'renderer', 'assets'),
      },
      {
        // Copy ./resources/icons/png/1024.png to ./webpack/main/assets/logo.png
        from: path.resolve(__dirname, '..', 'resources', 'icons', 'png'),
        to: path.resolve(__dirname, '..', '.webpack', 'main', 'assets'),
      },
    ],
  }),
]
