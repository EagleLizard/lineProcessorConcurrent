;(()=>{

  module.exports = {
    countLines : countLines,
    countLinesSync : countLinesSync,
    requestPathFromMaster : requestPathFromMaster,
    handleMessageFromMaster : handleMessageFromMaster
  };

  var fs = require('fs');
  var cluster = require('cluster');
  var _ = require('lodash');

  var SUPPORTED_EXTENSIONS = require('./fileUtil').fromJson('./supportedExtensions.json');

  const NL = '\n';

  function countLines(filePaths, numWorkers){
    var resolve;
    var resultPromise = new Promise((_resolve)=>{
      resolve = _resolve;
    });
    var workersWorking = 0;
    var totalLines = 0;
    var totalComments = 0;
    var extensionMap = new Map();

    if(filePaths.length < numWorkers){
       numWorkers = filePaths.length;
    }
    if(cluster.isMaster){
      Array(numWorkers).fill().forEach(()=>{
        var worker = cluster.fork();
        worker.on('message', (msg)=>{
          switch(msg.type){
            case 'lookingForWork':
              if(!filePaths.length){
                break;
              }
              workersWorking++;
              worker.send({
                'type': 'work',
                'path': filePaths.pop()
              });
              break;
            case 'workCompleted':
              totalLines += msg.lineCount;
              totalComments += msg.commentCount;
              if(!extensionMap.has(msg.extension)){
                extensionMap.set(msg.extension, 0);
              }
              extensionMap.set(msg.extension, extensionMap.get(msg.extension)+msg.lineCount);
              workersWorking--;
              break;
          }
          if(!(workersWorking||filePaths.length)){
            resolve(
              getResultObject({
                lineCount: totalLines,
                commentCount: totalComments,
                extensionMap: extensionMap
              })
            );
          }
        });
      });
    }else{
      console.log('but how');
    }
    return resultPromise;
  }

  function requestPathFromMaster(){
    if(!cluster.isWorker) return;
    process.send({
      'type': 'lookingForWork'
    });
  }

  function getResultObject(params){
    var result;
    params = params || {};
    result = {
      lineCount: params.lineCount || 0,
      commentCount: params.commentCount || 0,
      extensionMap: params.extensionMap || new Map()
    };
    return result;
  }

  function handleMessageFromMaster(msg){
    var result;
    if(msg.type === 'work'){
      result = countFileLinesSync(msg.path);
      process.send({
        type: 'workCompleted',
        path: msg.path,
        lineCount: result.lineCount,
        commentCount: result.commentCount,
        extension: result.extension
      });
      requestPathFromMaster();
    }
  }

  function countLinesSync(filePaths){
    var resolve;
    var resultPromise = new Promise((_resolve)=>resolve=_resolve);
    var result = filePaths.map(countFileLinesSync).reduce((acc,curr)=>{
      acc.lineCount += curr.lineCount;
      acc.commentCount += curr.commentCount;
      if(!acc.extensionMap.has(curr.extension)){
        acc.extensionMap.set(curr.extension, 0);
      }
      acc.extensionMap.set(curr.extension, acc.extensionMap.get(curr.extension) + curr.lineCount);
      return acc;
    },getResultObject());
    resolve(result);
    return resultPromise;
  }

  function countFileLinesSync(filePath){
    var skipLine;
    var numLines = 0;
    var numComments = 0;
    var extension = filePath.split('.').pop().trim();
    var extensionConfig = _.find(SUPPORTED_EXTENSIONS, {'extension':extension});
    var singleLineCommentPattern = extensionConfig && extensionConfig.singleLineCommentPattern;
    var checkForSingleLineComments = singleLineCommentPattern
                                  && singleLineCommentPattern.length;
    var fileString = fs.readFileSync(filePath).toString().split(NL).forEach((line)=>{
      line = line.trim();
      if(line!==''){
        skipLine = false;
        if(extensionConfig.singleLineCommentPattern){
          skipLine = line.slice(0, singleLineCommentPattern.length) === singleLineCommentPattern;
        }
        skipLine ? numComments++
                 : numLines++ ;
      }
    });
    return {
      lineCount: numLines,
      commentCount: numComments,
      extension: extension
    };
  }

})();
