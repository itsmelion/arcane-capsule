const fs = require('fs');
const path = require('path');

module.exports = class Resumable {
  constructor(temporaryFolder) {
    fs.mkdirSync(temporaryFolder);
    this.maxFileSize = null;
    this.cleanIdentifier = identifier => identifier.replace(/^0-9A-Za-z_-/img, '');
    this.getChunkFilename = (chunkNumber, identifier) => {
      // Clean up the identifier
      const id = this.cleanIdentifier(identifier);
      return path.join(temporaryFolder, `./${id}.${chunkNumber}`);
    };
  }

  // 'found' | 'not_found'
  get({ body }, callback) {
    const { fields } = body;
    const chunkNumber = parseInt(fields.resumableChunkNumber, 10);
    const identifier = fields.resumableIdentifier;
    const chunkFilename = this.getChunkFilename(chunkNumber, identifier);

    const fileExist = fs.existsSync(chunkFilename);
    callback(fileExist);
    return fileExist;
  }

  // 'partly_done' | 'done' | 'invalid_resumable_request' | 'non_resumable_request'
  post(req, callback) {
    const { files, body: fields } = req;
    const chunkNumber = parseInt(fields.resumableChunkNumber, 10);
    const identifier = fields.resumableIdentifier;
    const numberOfChunks = parseInt(fields.resumableTotalChunks, 10) + 1;
    const chunkFilename = this.getChunkFilename(chunkNumber, identifier);

    if (!files.file || !files.file.size) {
      return callback(false, 'invalid_resumable_request');
    }

    // Save the chunk
    return fs.rename(files.file.path, chunkFilename, () => {
      // Do we have all the chunks?
      let currentTestChunk = 1;
      const testChunkExists = () => {
        fs.exists(this.getChunkFilename(currentTestChunk, identifier), (exists) => {
          if (exists) {
            currentTestChunk++;

            if (currentTestChunk > numberOfChunks) {
              callback(true, 'done');
            } else testChunkExists();
          } else callback(true, 'partly_done');
        });
      };
      testChunkExists();
    });
  }

  write(identifier, writableStream, options = {}) {
    options.end = !options.end ? true : options.end;

    // Iterate over each chunk
    const pipeChunk = (number) => {
      const chunkFilename = this.getChunkFilename(number, identifier);
      fs.exists(chunkFilename, (exists) => {
        if (exists) {
          // If the chunk with the current number exists,
          // then create a ReadStream from the file
          // and pipe it to the specified writableStream.
          const sourceStream = fs.createReadStream(chunkFilename);
          sourceStream.pipe(writableStream, {
            end: false,
          });
          sourceStream.on('end', () => {
            // When the chunk is fully streamed,
            // jump to the next one
            pipeChunk(number + 1);
          });
        } else {
          // When all the chunks have been piped, end the stream
          if (options.end) writableStream.end();
          if (options.onDone) options.onDone();
        }
      });
    };
    pipeChunk(1);
  }

  clean(identifier, options = {}) {
    // Iterate over each chunk
    const pipeChunkRm = (number) => {
      const chunkFilename = this.getChunkFilename(number, identifier);

      fs.exists(chunkFilename, (exists) => {
        if (exists) {
          console.info('exist removing ', chunkFilename);
          fs.unlink(chunkFilename, (err) => {
            if (err && options.onError) options.onError(err);
          });

          pipeChunkRm(number + 1);
        } else if (options.onDone) options.onDone();
      });
    };
    pipeChunkRm(1);
  }
};