const AWS = require('aws-sdk');

const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
});

class Storage {
  constructor() {
    this.concatFiles = folder => Buffer.concat(folder.map(item => item));
  }

  saveStream(folder, originalName, fileType) {
    return new Promise((resolve, reject) => {
      S3.putObject({
        ACL: 'public-read',
        Key: originalName,
        Body: this.concatFiles(folder),
        Bucket: process.env.BUCKET_NAME,
        ContentType: fileType,
      }, (error) => {
        if (error) {
          console.error(error);
          return reject(error.message);
        }
        console.info(`File uploaded: ${originalName}`);
        return resolve(file.name);
      });
    });
  }
}

module.exports = Storage;
