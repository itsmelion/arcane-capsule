require('dotenv').config(); // Expose environment variables on this document
const AWS = require('aws-sdk');

const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
});

module.exports = function checkFile(filename) {
  return new Promise(((resolve, reject) => {
    S3.headObject({
      Key: filename,
      Bucket: process.env.BUCKET_NAME,
    }, (error) => {
      if (error) {
        if (error.code === 'NotFound') {
          console.info(`File not found: ${filename}`);
          return resolve();
        }
        return reject(error);
      }
      console.info(`File exists: ${filename}`);
      return resolve(filename);
    });
  }));
};
