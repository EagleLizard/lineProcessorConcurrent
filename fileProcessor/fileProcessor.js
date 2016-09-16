/*
  This is intended to provide a way to process a file line-by-line
    Because file processing is intended to be done concurrently on
    multiple threads, dependencies on other files cannot exist.
  The user-defined callback will be called once for line. The processor
    is completely agnostic to side-effects and state; it calls a function
    that returns a function. Each returned function will be called in order
    once the file has been read completely. This allows better side-effect
    management.
 */
;(()=>{
  
  let fs = require('fs');
  
  module.exports = {
    getProcessor: getProcessor
  }
  
  function getProcessor(filePath){
    return new FileProcessor(filePath);
  }
  
  function FileProcessor(filePath){
    let actions = [];
    
    this.process = process;
    this.addAction = addAction;
    this.executeActions = executeActions;
    this.getActions = getActions;
    
    function process(){
      fs.readFileSync(filePath)
        .toString()
        .split('\n')
        .forEach(line=>{
          console.log(line);
          processLine(line)
        });
      return this;
    }
    
    function processLine(lineStr){
      actions.forEach(action=>action.add(lineStr));
    }
    
    function addAction(action){
      actions.push(action);
    }
    
    function executeActions(){
      return actions.map(action=>action.execute());
    }
    
    function getActions(){
      return actions;
    }
    
  }
  
})();