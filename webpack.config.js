module.exports = {
  module: {
    rules: [
      {
        test: /\.xml$/,
        use: 'raw-loader',
      }
    ]
  }
};
