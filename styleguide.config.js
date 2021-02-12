
const { version } = require('./package.json');

module.exports = {
  components: 'src/[A-Z]*.jsx',
  defaultExample: false,
  ribbon: {
    url: 'https://github.com/styleguidist/react-styleguidist',
  },
  require: ['babel-polyfill'],
  version,
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader',
        },
      ],
    },
  },
  template: {
    head: {
      links: [
        {
          rel: 'stylesheet',
          href: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
          crossorigin: 'anonymous',
        },
        {
          rel: 'stylesheet',
          href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css',
          integrity: 'sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M',
          crossorigin: 'anonymous',
        },
      ]
    }
  },
  styles: {
    StyleGuide: {
      '@global button.rsg--button-38': {
        display: 'none',
      },
    },
  },
};