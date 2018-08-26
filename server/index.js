require('dotenv').config(); // Expose environment variables on this document
const http = require('http');
const path = require('path');
const express = require('express');
const io = require('socket.io');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const HotModuleReplacement = require('webpack-hot-middleware');
const webpackConfig = require('../webpack.config.dev');
const webpackConfigProd = require('../webpack.config');
const routes = require('./routes');

const isDev = process.env.NODE_ENV === 'development';
const compiler = webpack(isDev ? webpackConfig : webpackConfigProd);

const app = express();

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

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(compression()); // enable gzip compression.

app.use('/assets', express.static(path.join(__dirname, 'assets'))); // expose a folder
app.use('/capsule', routes); // add API route settings

// handle 404
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

// handle server errors
app.use((err, req, res) => {
  console.error('\x1b[31m', err.stack, '\x1b[0m');
  res.status(err.status || 500).json({ message: err.message, error: err });
});

const port = isDev ? process.env.nodePort : (process.env.PORT || 80);
const server = http.createServer(app);

server.listen(port, process.env.HOST, () => {
  console.info(`🖥️  ${process.env.appName} up at: ${process.env.HOST}:${port}`);
});

io(server)
  .on('connection', (socket) => {
    socket.emit('server', { hello: 'world' });
    socket.on('client', data => console.log(data));
  });
