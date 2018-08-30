require('dotenv').config(); // Expose environment variables on this document
const http = require('http');
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');
const webpack = require('webpack');
const io = require('socket.io');
const webpackDevMiddleware = require('webpack-dev-middleware');
const HotModuleReplacement = require('webpack-hot-middleware');
const webpackConfig = require('../webpack.config.dev');
const webpackConfigProd = require('../webpack.config');
const routes = require('./routes');

const isDev = process.env.NODE_ENV === 'development';
const compiler = webpack(isDev ? webpackConfig : webpackConfigProd);

const app = express();
const server = http.createServer(app);
const socket = io(server);

app.set('io', socket);

// start webpack compiler, together with node process.
app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  noInfo: true,
  hot: true,
  inline: true,
  logLevel: 'warn',
}));

// enables hot module replacement
app.use(HotModuleReplacement(compiler));

app.use(cors()); // allow cors
app.use(multipart());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(compression()); // enable gzip compression.

// Handle uploads through Resumable.js
app.use('/upload', routes);

const port = isDev ? process.env.nodePort : (process.env.PORT || 80);

server.listen(port, process.env.HOST, () => {
  console.info(`🖥️  ${process.env.appName} up at: ${process.env.HOST}:${port}`);
});
