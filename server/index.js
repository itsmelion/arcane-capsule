const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const http = require('http');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../webpack.config.dev');
const webpackConfigProd = require('../webpack.config');

require('dotenv').config();

const isDev = process.env.NODE_ENV === 'development';
const compiler = webpack(isDev? webpackConfig : webpackConfigProd);

const routes = require('./routes');
const app = express();

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
  next();
});

app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath
}));

app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(compression());

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/capsule', routes);

const server = http.createServer(app);

const port = isDev ? process.env.nodePort : (process.env.PORT || 80);
server.listen(port, process.env.HOST, () => {
  console.info(`🖥️ ${process.env.appName} up at: ${process.env.HOST}:${port}`);
});
