var PromiseWorker = require('promise-worker-transferable');
var PromiseFileReader = require('promise-file-reader');

var config = require('./itkConfig.js');

var worker = new window.Worker(config.webWorkersPath + '/ImageIOWorker.js');
var promiseWorker = new PromiseWorker(worker);

/**
 * @param: blob Blob that contains the file contents
 * @param: fileName string that contains the file name
 * @param: mimeType optional mime-type string
 */
var readImageBlob = function readImageBlob(blob, fileName, mimeType) {
  return PromiseFileReader.readAsArrayBuffer(blob).then(function (arrayBuffer) {
    return promiseWorker.postMessage({ name: fileName, type: mimeType, buffer: arrayBuffer, config: config }, [arrayBuffer]);
  });
};

module.exports = readImageBlob;