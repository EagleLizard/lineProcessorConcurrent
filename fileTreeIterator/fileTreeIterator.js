;(()=>{
  
  const SUPRESS_OUT = !! 1;
  
  let fs = require('fs');
  
  let directoryIterator = require('./directoryIterator');
  
  module.exports = {
    getIt: getIt
  };
  
  function getIt(rootPath){
    return new FileTreeIterator(rootPath);
  }
  
  function FileTreeIterator(rootPath){
    
    let soFar = [directoryIterator.getIt(rootPath)]; //will contain every directory path we've descended into
    let currentFile = null;
    let done = false;
    
    this.next = next;
    this.value = value;
    this.getCurrentFile = getCurrentFile;
    
    function next(){
      if(getCurrent().next() === null){
        return ascend();
      }
      out(getCurrent().getCurrentFullPath());
      // out(getCurrent().currentIsFile());
      out('isDone: ', getCurrent().isDone());
      if(getCurrent().currentIsFile()){
        // out('setting currentFile: ', getCurrent().getCurrentFullPath());
        return currentFile = getCurrent().getCurrentFullPath();
      }
      if(getCurrent().isDone() && soFar.length>1){
        
        return ascend();
      }else if(getCurrent().currentIsDir()){
        return descend();
      }
      return currentFile;
    }
    
    function value(){
      return getCurrent().getCurrentFullPath();
    }
    
    function getCurrent(){
      return soFar[soFar.length-1];
    }
    
    function getCurrentFile(){
      return currentFile;
    }
    
    function isDone(){
        return done;
    }
    
    function descend(){
      //traverse into a directory until next file is found
      // out(getCurrent().getCurrentFullPath());
      soFar.push(directoryIterator.getIt(getCurrent().getCurrentFullPath()));
      return next();
    }
    
    function ascend(){
      // traverse out of the current directory until next file is found
      out('Ascend');
      // out(soFar);
      if(soFar.length>1){
        soFar.length--;
        return next();
      }else{
        done = true;
        return currentFile = null;
      }
      
    }
    
  }
  
  function out(){
    if(SUPRESS_OUT) return;
    console.log([...arguments].join(''));
  }
  
})();