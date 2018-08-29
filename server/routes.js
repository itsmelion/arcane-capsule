require('dotenv').config(); // Expose environment variables on this document
const fs = require('fs');
const { resolve } = require('path');
const express = require('express');
const checkFile = require('./lib/checkFile');
const createFile = require('./lib/createFile');
const mergeFiles = require('./lib/mergeFiles');
const getChunkFilename = require('./lib/getChunkFilename');
const EncoderService = require('./handlers/encode');
const Resumable = require('./lib/Resumable')(resolve(__dirname, 'tmp'));

const router = express.Router();
const Encoder = new EncoderService();

// retrieve file id. invoke with /fileid?filename=my-file.jpg
router.get('/fileid', (req, res) => {
  if (!req.query.filename) {
    return res.status(500)
      .end('query parameter missing');
  }

  res.end(req.query.filename);
});

// Handle uploads through Resumable.js
router.post('/resumable', (req, res) => {
  Resumable.post(req, (status) => {
    console.info('POST', status);

    res.send(status);
  });
});

router.get('/resumable', (req, res) => {
  Resumable.get(req, (status) => {
    console.info('GET', status);
    res.status(status ? 200 : 404);
  });
});

router.get('/resumable/:identifier', (req, res) => {
  Resumable.write(req.params.identifier, res);
});

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
      if (filename) {
        console.log('got file');
        res.status(200).send(`https://arcanecapsule.s3.amazonaws.com/${filename}`);
      } else {
        console.log('no content');
        res.status(204).send('No content');
      }
    })
    .catch((error) => {
      console.log('File not found yet, may be processing');
      res.status(500).send({
        message: 'File not found yet, may be processing',
        error,
      });
    });
});

router.post('/', async (req, res) => {
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

  const fileExists = await checkFile(chunkFilename);

  if (fileExists) {
    const name = await mergeFiles(fileExists, filetype, numberOfChunks);

    return res.status(200)
      .send(`https://arcanecapsule.s3.amazonaws.com/${name}`);
  }

  createFile({
    name: chunkFilename,
    type: filetype,
    buffer: fs.readFileSync(file.path),
  })
    .then(filename => mergeFiles(filename, filetype, numberOfChunks))
    .then((filename) => {
      res.status(200).send(`https://arcanecapsule.s3.amazonaws.com/${filename}`);
    })
    .catch(error => res.status(500).send(error));
});

router.get('/ready', (req, res) => {
  const io = req.app.get('io');
  const response = {
    // name: filename,
    progress: 'completed',
    url: `https://arcanecapsule.s3.amazonaws.com/${filename}`,
  };
  io.sockets.emit('client', response);

  res.status(200);
});

module.exports = router;
