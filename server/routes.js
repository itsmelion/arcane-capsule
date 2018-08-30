const { resolve } = require('path');
const express = require('express');

const ResumableService = require('./handlers/Resumable');
const StorageService = require('./handlers/Storage');
// const EncoderService = require('./handlers/Encode');

const router = express.Router();
const Resumable = new ResumableService(resolve(__dirname, 'tmp'));
const Storage = new StorageService();
// const Encoder = new EncoderService();

// Handle uploads through Resumable.js
router.post('/', async (req, res) => {
  const { resumableFilename, resumableType, resumableIdentifier } = req.body;
  let status = Resumable.saveChunk(req);

  if (status === 'completed') {
    // store on S3
    const folder = Resumable.chunksFolder(resumableIdentifier);
    const file = await Storage.saveStream(folder, resumableFilename, resumableType);
    // Not implemented const encodedFile = await Encoder.submit(file);
    // Not implemented status = encodedFile;
    status = file;
  }

  res.status(201).send(status);
});

router.get('/', (req, res) => {
  Resumable.get(req, (status) => {
    console.info('GET', status);
    res.status(status ? 200 : 404);
  });
});

router.get('/:identifier', (req, res) => {
  Resumable.write(req.params.identifier, res);
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
