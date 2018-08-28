

const path = require('path');
const cleanIdentifier = require('./cleanIdentifier');

module.exports = function getChunkFilename(name, folder, chunkNumber) {
  // Clean up the filename
  let filename = cleanIdentifier(name);

  if (typeof (chunkNumber) !== 'undefined') {
    filename = `${filename}.${chunkNumber}`;
  }

  // What would the file name be?
  return path.join('.chunks', folder, filename);
};
