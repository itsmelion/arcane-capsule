const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const webpackConfig = require('../webpack.config.dev');
const webpackConfigProd = require('../webpack.config');
const routes = require('./routes');

// Expose environment variables on this document
require('dotenv').config();

const isDev = process.env.NODE_ENV === 'development';
const compiler = webpack(isDev ? webpackConfig : webpackConfigProd);

const app = express();

// start webpack compiler, together with node process.
app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
}));

app.use(cors()); // allow cors
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(compression()); // enable gzip compression.

app.use('/assets', express.static(path.join(__dirname, 'assets'))); // expose a folder
app.use('/capsule', routes); // add API route settings

const server = http.createServer(app);

const port = isDev ? process.env.nodePort : (process.env.PORT || 80);
server.listen(port, process.env.HOST, () => {
  console.info(`🖥️ ${process.env.appName} up at: ${process.env.HOST}:${port}`);
});
