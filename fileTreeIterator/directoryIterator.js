;(()=>{
  
  let fs = require('fs');
  
  module.exports = {
    getIt: getIt
  };
  
  function getIt(directoryPath){
    return new DirectoryIterator(directoryPath);
  }
  
  function DirectoryIterator(directoryPath){
    
    let path = directoryPath;
    let files = fs.readdirSync(directoryPath);
    let currentFile = null;
    let currentFileIdx = 0;
    
    this.next = next;
    this.isDone = isDone;
    this.getPath = getPath;
    this.getCurrent = getCurrent;
    this.currentIsFile = currentIsFile;
    this.currentIsDir = currentIsDir;
    this.getCurrentFullPath = getCurrentFullPath;
    
    function next(){
      return isDone() ? null
                      : currentFile = files[currentFileIdx++] ;
    }
    
    function isDone(){
      return !files.length || currentFileIdx>=files.length;
    }
    
    function getPath(){
      return path;
    }
    
    function getCurrent(){
      return currentFile;
    }
    
    function currentIsFile(){
      return fs.statSync(getCurrentFullPath()).isFile();
    }
    
    function currentIsDir(){
      return fs.statSync(getCurrentFullPath()).isDirectory();
    }
    
    function getCurrentFullPath(){
      return path+'/'+getCurrent();
    }
  }
  
})();