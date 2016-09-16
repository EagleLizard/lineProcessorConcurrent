;(()=>{
  
  let fileProcessor = require('./fileProcessor');
  let fileLineAction = require('./fileLineAction');
  
  let testFiles = [
    './../testDir/subDir1/testFile4.rb',
    './../testDir/testFile2.js',
    './../testDir/subDir2/subDir4/stuff.java'
  ];
  
  let testActions = [
    fileLineAction.getAction(str=>(()=>str.length)),
    fileLineAction.getAction(str=>(()=>str.charAt(0))),
    fileLineAction.getAction(str=>(()=>str.split('').reduce((acc,curr)=>(acc+=curr.charCodeAt(0),acc),0))),
    fileLineAction.getAction(str=>(()=>str.split('').reverse().join('')))
  ];
  
  main();
  
  function main(){
    testFiles.forEach(filePath=>{
      let processor = fileProcessor.getProcessor(filePath);
      testActions.forEach(action=>processor.addAction(action));
      console.log(processor.process().executeActions());
      
    });
  }
  
})();