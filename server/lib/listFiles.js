

const AWS = require('aws-sdk');

const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
});

module.exports = function listFiles(prefix) {
  return new Promise(((resolve, reject) => {
    S3.listObjects({
      Prefix: prefix,
      Bucket: process.env.BUCKET_NAME,
    }, (error, data) => {
      if (error) return reject(error.message);
      return resolve(data.Contents);
    });
  }));
};
