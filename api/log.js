const log = require('loglevel');

const isProd = (process.env.NODE_ENV === 'production');
const level = process.env.LOG_LEVEL || (isProd ? 'info' : 'trace');

log.setLevel(level);

module.exports = log;
