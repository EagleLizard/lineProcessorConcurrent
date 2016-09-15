;(()=>{

  var cluster = require('cluster');
  
  var _ = require('lodash');
  var cmd = require('commander');

  var parseFlags = require('./parseFlags');
  var getFilePaths = require('./fileUtil').getPaths;
  var fromJson = require('./fileUtil').fromJson;
  var lineCounter = require('./lineCounter');

  const FLAGS = require('./flagConstants');
  const SUPPORTED_EXTENSIONS = fromJson('./supportedExtensions.json');
  const NUM_WORKERS = require('os').cpus().length-1;//one thread is master

  if(cluster.isMaster){
    main();
  }else{
    lineCounter.requestPathFromMaster();
    process.on('message', (msg)=>{
      lineCounter.handleMessageFromMaster(msg);
    });
  }

  function main(){
    var startPath, flagMap, fileList, extRx, excludeRx, useSynchronous, numLinesPromise, startTime;

    flagMap = parseFlags(process.argv);
    startPath = flagMap.get(FLAGS.PATH) || './';
    extRx = getExtensionsRegex(flagMap.get(FLAGS.EXTENSIONS));
    if(extRx===null){
      console.error('unsupported extensions provided.');
      process.exit(1);
    }
    excludeRx = getExcludeRx(flagMap.get(FLAGS.EXCLUDERX));
    useSynchronous = flagMap.has(FLAGS.FORCESYNC) || NUM_WORKERS < 2;
    fileList =  getFilePaths(startPath, extRx, excludeRx);
    console.log('Running in ',(useSynchronous?'sync':'async'), ' mode');
    startTime = _.now();
    numLinesPromise = useSynchronous ? lineCounter.countLinesSync(fileList)
                                     : lineCounter.countLines(fileList, NUM_WORKERS);
    numLinesPromise.then((result)=>{
      console.log('Line total: ', result.lineCount);
      console.log('Comment total: ', result.commentCount);
      result.extensionMap.forEach((val, key)=>console.log(key, ': ', val));
      console.log('Execution Time: ', _.now()-startTime,'ms')
      process.exit(0);
    });
  }

  function getExcludeRx(rxString){
    var excludeRx;
    if(!rxString) return null;
    try{
      excludeRx = new RegExp(rxString);
    }catch(e){
      excludeRx = null;
    }
    return excludeRx;
  }

  //returns null if any extensions are invalid
  function getExtensionsRegex(extensions){
    extensions = (extensions && extensions.split(' '))  || SUPPORTED_EXTENSIONS.map((ext)=>ext.extension);
    console.log(extensions);
    extensions = extensions.filter(isSupportedExtension);
    console.log(extensions);
    if(!extensions.length) return null;
    var rxString = extensions.reduce((acc,curr,idx)=>{
      return acc+((idx||'')&&'|')+curr;
    },'\\.(').concat(')$');
    console.log(rxString);
    return new RegExp(rxString);
  }

  function isSupportedExtension(ext){
    return !!_.find(SUPPORTED_EXTENSIONS, {extension: ext});
  }

})();
