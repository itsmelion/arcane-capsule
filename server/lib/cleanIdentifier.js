
module.exports = function cleanIdentifier(identifier) {
  return identifier.replace(/^0-9A-Za-z_-/img, '');
};
