const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [
          // creates 'style' nodes from JS strings
          'style-loader',

          // translates CSS into CommonJS
          'css-loader',

          // compiling sass to css
          {
            loader: 'sass-loader',
            options: {
              implementation: require('dart-sass')
            }
          }
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    node: 'current'
                  }
                }
              ]
            ],
            plugins: [
              ['@babel/plugin-proposal-class-properties', {loose: true}],
              ['@babel/plugin-proposal-private-methods', {loose: true}]
            ]
          }
        }
      }
    ]
  }
};
