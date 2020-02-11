const path = require('path')
const fs = jest.genMockFromModule('fs');

//the keys will be paths to files or directories
// the values will be the file value, or a boolean signifying a directory exists
let mockFiles = {};

function __setMockFiles(newMockFiles) {
  mockFiles = Object.assign({}, newMockFiles);
}

function readFileSync(mockFilePath) {
  return mockFiles[mockFilePath];
}

function writeFileSync(filePath, data) {
  mockFiles[filePath] = data;
}

function existsSync(filePath) {
  return (mockFiles[filePath] !== undefined);
}

function appendFile(filePath, data) {
  mockFiles[filePath] = mockFiles[filePath] + data;
}

function unlinkSync(filePath) {
  delete mockFiles[filePath];
}

function isPrefix(prefix, str) {
  if (prefix.length === str.length) {
    return false;
  }
  for (let i=0; i < prefix.length; i++) {
    if (prefix[i] !== str[i]) {
      return false;
    }
  }
  return true;
}

function rmdirSync(dirPath) {
  if (mockFiles[dirPath] === true) {
    for (let path in mockFiles) {
      if (isPrefix(dirPath, path)) {
        throw new Error("this directory is not empty")
      }
    }
    delete mockFiles[dirPath];
  }
}

fs.__setMockFiles = __setMockFiles;
fs.readFileSync = readFileSync;
fs.writeFileSync = writeFileSync;
fs.existsSync = existsSync;
fs.appendFile = appendFile;
fs.unlinkSync = unlinkSync;
fs.rmdirSync = rmdirSync;

module.exports = fs;
