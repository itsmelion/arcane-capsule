require('dotenv-extended').load(); // Expose environment variables on this document
const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const s3Router = require('react-s3-uploader/s3router');
const Zencoder = require('zencoder');
const log = require('./log');
const File = require('./model');

const app = express();
const server = http.Server(app);
const io = socketIO(server);
const zencoder = Zencoder();

app.use(cors()); // allow cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin","X-Requested-With", "Content-Type", "Accept");
  next();
});
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

const bucket = process.env.BUCKET_NAME;
const region = process.env.AWS_REGION;
app.use('/s3', s3Router({ bucket, region, ACL: 'public-read' }));

const { BUCKET_URL } = process.env;

const outputParams = (id, name) => [
  {
    label: 'mp4',
    url: `${BUCKET_URL}/${id}/${name}.mp4`,
    public: true,
    h264_profile: 'high',
    audio_bitrate: 160,
    max_video_bitrate: 5000,
    h264_profile: 'high',
    max_frame_rate: 30,
  },
  {
    url: `${BUCKET_URL}/${id}/${name}.webm`,
    label: 'webm',
    format: 'webm',
    public: true,
  },
  {
    url: `${BUCKET_URL}/${id}/${name}.ogg`,
    label: 'ogg',
    format: 'ogg',
    public: true,
  },
];

app.get('/files', async (req, res) => {
  const files = await File.find().lean();
  return res.json(files);
});

app.post('/files', async (req, res) => {
  const { body } = req;

  log.debug('new file uploaded');

  const file = await File.create({
    name: body.fileName,
    status: 'uploaded',
    rawFileUrl: `${BUCKET_URL}/${body.fileKey}`,
    rawFilePath: body.fileKey,
  });

  log.debug('uploaded file registered');

  const input = file.rawFileUrl;
  const notifications = [{ url: `${process.env.PUBLIC_URL}/files/${file._id}/encoding` }];

  const encodeJob = await zencoder.Job
    .create({ input, notifications, outputs: outputParams(file._id, file.name) })
    .then(({ data }) => data);

  log.debug('transcoding started');

  file.set({ encoderId: encodeJob.id, status: 'encoding' }).save();

  return res.json({ id: file._id, status: 'encoding' });
});

app.post('/files/:fileId/encoding', async (req, res) => {
  const { fileId } = req.params;
  const { outputs } = req.body;

  log.debug('Webhook notification from Zencoder');

  const file = await File.findOne({ _id: fileId });

  const parsedOutputs = outputs.map(output => ({
    _id: output.id,
    url: output.url,
    format: output.label,
  }));

  file.set({ encoderOutputs: parsedOutputs, status: 'completed' }).save();
  const { _id } = file.toObject();

  io.emit(_id, 'completed');

  log.debug('Videos converted and saved with success ✅');
  return res.json({ status: 'completed' });
});

app.get('/files/:fileId', async (req, res) => {
  const { fileId } = req.params;


  const file = await File.findById(fileId).lean()
    .catch(e => log.error('Not found file', e));

  return res.json(file);
});


server.listen(process.env.PORT, process.env.HOST, () => {
  log.info(`🖥️  ArcaneCapsule API up at: ${process.env.HOST}:${process.env.PORT}`);
});
