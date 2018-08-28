require('dotenv').config(); // Expose environment variables on this document
const fs = require('fs');
const express = require('express');
const checkFile = require('./lib/checkFile');
const createFile = require('./lib/createFile');
const mergeFiles = require('./lib/mergeFiles');
const getChunkFilename = require('./lib/getChunkFilename');

const router = express.Router();

router.get('/', (req, res) => {
  const params = req.query;
  const folder = params.path;
  const filename = params.resumableFilename;
  const filetype = params.resumableType;
  const chunkSize = parseInt(params.resumableChunkSize, 10);
  const totalSize = parseInt(params.resumableTotalSize, 10);
  const chunkNumber = parseInt(params.resumableChunkNumber, 10);
  const numberOfChunks = Math.max(Math.floor(totalSize / (chunkSize * 1.0)), 1);
  const chunkFilename = getChunkFilename(filename, folder, chunkNumber);

  checkFile(chunkFilename)
    .then(filename => mergeFiles(filename, filetype, numberOfChunks))
    .then((filename) => {
      if (typeof (filename) !== 'undefined') {
        res.status(200).send(`https://arcanecapsule.s3.amazonaws.com/${filename}`);
      } else {
        res.status(204).send(error);
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.post('/', (req, res) => {
  const params = req.query;
  const folder = params.path;
  const filename = params.resumableFilename;
  const filetype = params.resumableType;
  const chunkSize = parseInt(params.resumableChunkSize, 10);
  const totalSize = parseInt(params.resumableTotalSize, 10);
  const chunkNumber = parseInt(params.resumableChunkNumber, 10);
  const numberOfChunks = Math.max(Math.floor(totalSize / (chunkSize * 1.0)), 1);
  const { file } = req.files;
  const chunkFilename = getChunkFilename(filename, folder, chunkNumber);

  createFile({ name: chunkFilename, type: filetype, buffer: fs.readFileSync(file.path) })
    .then(filename => mergeFiles(filename, filetype, numberOfChunks))
    .then((filename) => {
      res.status(200).send(`https://arcanecapsule.s3.amazonaws.com/${filename}`);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

module.exports = router;
