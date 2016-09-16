;(()=>{
  let fileTreeIterator = require('./fileTreeIterator');

  module.exports = {
    getIt: getIt
  };

  function getIt(rootPath, excludeRegex){
    return new FileTreeFilterIterator(rootPath, excludeRegex);
  }

  function FileTreeFilterIterator(rootPath, excludeRegex){
    let fileTreeIt = fileTreeIterator.getIt(rootPath);
    
    if(!Array.isArray(excludeRegex)) excludeRegex = [excludeRegex];
    excludeRegex.map((rx)=>((typeof rx)==='string')?new RegExp(rx):rx);
    
    this.next = next;
    this.value = value;
    
    function next(){
      let nextVal;
      while(nextVal = fileTreeIt.next()){
        if(!excludeRegex.some((rx)=>rx.test(nextVal))) return nextVal;
      }
      
      return null;
    }
    
    function value(){
      return fileTreeIt.value();
    }
    
  }
})();