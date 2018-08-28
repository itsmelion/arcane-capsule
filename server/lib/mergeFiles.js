

const AWS = require('aws-sdk');

const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
});

const getFile = require('./getFile');
const checkFile = require('./checkFile');
const listFiles = require('./listFiles');
const createFile = require('./createFile');

module.exports = function mergeFiles(filename, filetype, chunks) {
  const prefix = filename.replace(/\.[^/.]+$/, '');

  function completedFilename(filename) {
    return filename.replace('.chunks/', '')
      .replace(/\.[^/.]+$/, '');
  }

  return new Promise(((resolve, reject) => {
    checkFile(completedFilename(filename))
      .then((file) => {
        if (typeof (file) === 'undefined') {
          listFiles(prefix)
            .then((files) => {
              if (files.length == chunks) {
                console.log(`Received all chunks: ${completedFilename(filename)}`);

                return Promise.all(files.map(item => item.Key).map(getFile)).then(files => Buffer.concat(files.map(item => item.Body))).then(buffer => createFile({ name: completedFilename(filename), type: filetype, buffer }, 'public-read')).then(file => resolve(completedFilename(filename)))
                  .catch(error => resolve(filename));
              }
              console.log(`Missing chunks: ${completedFilename(filename)}`);
              return resolve(filename);
            }).catch(error => resolve(filename));
        } else {
          return resolve(completedFilename(filename));
        }
      }).catch(error => resolve(filename));
  }));
};
