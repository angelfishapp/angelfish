import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import type { Configuration } from 'webpack'

import { plugins } from './webpack.plugins'
import { rules } from './webpack.rules'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Add any additional rules needed
rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
})

// Add any additional plugins needed
plugins.push(
  isDevelopment &&
    new ReactRefreshPlugin({
      overlay: false,
    }),
)
plugins.filter(Boolean)

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  optimization: {
    // Configure minimization for TypeORM migrations to work
    // https://typeorm.io/#/faq/how-to-use-webpack-for-the-backend
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }) as any,
    ],
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
  /**
   * List all the external native modules that need to be excluded from
   * renderer build but built as native modules and packaged when packing
   * the app here
   */
  externals: {
    typeorm: 'commonjs typeorm',
    sqlite3: 'commonjs sqlite3',
  },
}
