require('dotenv').config(); // Expose environment variables on this document
const AWS = require('aws-sdk');

const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
});

module.exports = function createFile(file, acl = 'private') {
  return new Promise(((resolve, reject) => {
    S3.putObject({
      ACL: acl,
      Key: file.name,
      Body: file.buffer,
      Bucket: process.env.BUCKET_NAME,
      ContentType: file.type,
    }, (error) => {
      if (error) {
        console.info(error);
        return reject(error.message);
      }
      console.info(`File uploaded: ${file.name}`);
      return resolve(file.name);
    });
  }));
};
