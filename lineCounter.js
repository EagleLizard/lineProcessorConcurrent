;(()=>{



  module.exports = {
    countLines : countLines,
    countLinesSync : countLinesSync
  };

  var fs = require('fs');
  var cluster = require('cluster');
  var _ = require('lodash');

  const NL = '\n';

  function countLines(filePaths, numWorkers){
    var chunkSize = Math.ceil(filePaths.length/numWorkers);
    var chunks = _.chunk(filePaths, chunkSize)
                  .map((chunk)=>{
                    //convert each chunk to a key:value pair to pass to workers
                    return chunk.reduce(((acc,curr,idx)=>{
                      acc[idx] = curr;
                      if(idx == chunk.length-1)acc.length = idx+1;
                      return acc;
                    }),{})
                  });
    console.log(chunks[2]);
  }

  function countLinesSync(filePaths){
    return filePaths.map(countFileLinesSync).reduce((acc,curr)=>acc+curr,0);
  }

  function countFileLinesSync(filePath){
    var numLines = 0;
    var fileString = fs.readFileSync(filePath).toString().split(NL).forEach((line)=>{
      line = line.trim();
      if(line!=='') numLines++;
    });
    return numLines;
  }

})();
