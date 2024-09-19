const path = require('path');
const webpack = require('webpack')

module.exports = {
    entry: './src/index.tsx', // Entry point of your application
    output: {
      path: path.resolve(__dirname, 'build'),
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
    mode: 'production', // Set production mode for optimization
  };
