;(()=>{
  var fs = require('fs');

  var parseFlags = require('./parseFlags');
  var getFilePaths = require('./fileUtil').getPaths;
  var fromJson = require('./fileUtil').fromJson;
  var lineCounter = require('./lineCounter');

  const FLAGS = require('./flagConstants');
  const SUPPORTED_EXTENSIONS = fromJson('./supportedExtensions.json');
  const NUM_WORKERS = require('os').cpus().length-1;//one thread is master

  var useSynchronous = NUM_WORKERS < 2;

  main();

  function main(){
    var startPath, flagMap, fileList, extRx, excludeRx;

    flagMap = parseFlags(process.argv);
    startPath = flagMap.get(FLAGS.PATH) || './';
    extRx = getExtensionsRegex(flagMap.get(FLAGS.EXTENSIONS));
    if(extRx===null){
      console.error('unsupported extensions provided.');
      process.exit(1);
    }
    excludeRx = getExcludeRx(flagMap.get(FLAGS.EXCLUDERX));
    fileList =  getFilePaths(startPath, extRx, excludeRx);
    var numLines = 0;
    console.log('lineCounter total: ', lineCounter.countLinesSync(fileList, NUM_WORKERS));

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
    extensions = (extensions && extensions.split(' '))  || SUPPORTED_EXTENSIONS;
    extensions = extensions.filter(isSupportedExtension);
    if(!extensions.length) return null;
    var rxString = extensions.reduce((acc,curr,idx)=>{
      return acc+((idx||'')&&'|')+curr;
    },'\\.(').concat(')$');
    console.log(rxString);
    return new RegExp(rxString);
  }

  function isSupportedExtension(ext){
    //TODO: pull these from an actual config instead of always returning true
    return SUPPORTED_EXTENSIONS.indexOf(ext)!==-1;
  }

})();
