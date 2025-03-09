import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin'
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
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
}
