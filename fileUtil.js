;(()=>{

  var fs = require('fs');

  module.exports = {
    getPaths : getPaths,
    fromJson : fromJson
  };

  //recursivley search the given directory for files
  function getPaths(basePath, searchRx, excludeRx){
    fileList = [];
    getPathsHelper(basePath, '', fileList, searchRx, excludeRx);
    return fileList;
  }

  function getPathsHelper(targetDir, soFar, fileList, searchRx, excludeRx){
    var stat, fullPath, recurseResult, concatJoinString;
    var subDirectories = [];
    //ignore private directories and files
    if(targetDir[0]==='.' && targetDir[1]!=='/'){
      return null;
    }
    concatJoinString = (soFar.length && soFar[1]!=='/')?'/':'';
    fullPath = soFar.length
                ?soFar.concat('/',targetDir):targetDir;
    stat = fs.statSync(fullPath);
    if(stat.isFile()){
      if(searchRx.test(fullPath)){
        fileList.push(fullPath);
      }
    }else if(stat.isDirectory()){
      if(excludeRx && excludeRx.test(fullPath)) return null;
      fs.readdirSync(fullPath).forEach((val)=>{
        getPathsHelper(val, fullPath, fileList, searchRx, excludeRx);
      });
    }else{
      return null;
    }
  }

  function fromJson(filePath){
    return JSON.parse(fs.readFileSync(filePath).toString());
  }

})();
