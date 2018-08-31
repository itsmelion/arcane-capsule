const bluebird = require('bluebird');
const mongoose = require('mongoose');
const shortid = require('shortid');

mongoose.connect(process.env.DB_URL, { promiseLibrary: bluebird, useNewUrlParser: true });
const schema = mongoose.Schema({
  id: { type: String, default: shortid.generate },

  name: { type: String },
  status: { type: String },

  rawFileUrl: { type: String },
  rawFilePath: { type: String },

  encoderId: { type: String },
  encoderOutputs: [{
    id: { type: String },
    url: { type: String },
    format: { type: String },
  }],

}, { versionKey: false, timestamps: true });

module.exports = mongoose.model('File', schema);
