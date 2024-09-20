const path = require('path');
const webpack = require('webpack')

module.exports = (env) => {
  return {
    entry: './src/index.tsx', // Entry point of your application
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'widget.js',
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/, // Add support for TypeScript files
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript', // Add TypeScript preset
              ],
            },
          },
        },
        {
          test: /\.(png|jpeg|jpg|gif|svg)$/,
          use: 'file-loader',
        },
        {
          test: /\.css$/i,
          include: path.resolve(__dirname, 'src'),
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'], // Resolve both JS and TS files
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          CODE_SVC_URL: JSON.stringify(env.CODE_SVC_URL)
        }
      }),
    ],
    mode: 'production', // Set production mode for optimization
  }
};
