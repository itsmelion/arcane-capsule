const fs = require('fs');
const path = require('path');

module.exports = class Resumable {
  constructor(temporaryFolder) {
    if (!fs.existsSync(temporaryFolder)) fs.mkdirSync(temporaryFolder);
    this.temporaryFolder = temporaryFolder;
    this.cleanIdentifier = identifier => identifier.replace(/^0-9A-Za-z_-/img, '');

    this.getChunkFilename = (chunkNumber, identifier) => {
      // Clean up the identifier
      const id = this.cleanIdentifier(identifier);
      return path.join(temporaryFolder, `./${id}/${chunkNumber}`);
    };

    // Do we have all the chunks?
    this.verifyChunks = (folder, numberOfChunks) => {
      const missingChunks = [];

      for (let i = 1, chunks = numberOfChunks; i < chunks; i++) {
        if (!fs.existsSync(`${folder}/${i}`)) missingChunks.push(i);
      }

      return { isMissing: Boolean(missingChunks.length), missingChunks };
    };
  }

  chunkFolder(identifier) {
    const id = this.cleanIdentifier(identifier);
    return path.join(this.temporaryFolder, id);
  }

  get(query) {
    const { resumableChunkNumber, resumableIdentifier } = query;
    const chunkNumber = parseInt(resumableChunkNumber, 10);
    const identifier = resumableIdentifier;
    const chunkFilename = this.getChunkFilename(chunkNumber, identifier);

    const fileExist = fs.existsSync(chunkFilename);
    return fileExist;
  }

  saveChunk(req) {
    const { files: { file }, body: fields } = req;
    const identifier = fields.resumableIdentifier;
    const chunkNumber = parseInt(fields.resumableChunkNumber, 10);
    const numberOfChunks = parseInt(fields.resumableTotalChunks, 10);
    const folder = this.chunkFolder(identifier);
    const { isMissing } = this.verifyChunks(folder, numberOfChunks);
    if (!file || !file.size) return false;

    // Save the chunk
    if (isMissing) {
      if (!fs.existsSync(folder)) fs.mkdirSync(folder);
      fs.writeFileSync(`${folder}/${chunkNumber}`, fs.readFileSync(file.path));

      const recheckIsMissing = this.verifyChunks(folder, numberOfChunks).isMissing;
      if (!recheckIsMissing) return 'completed';
      return recheckIsMissing;
    }

    return 'completed';
  }
};
