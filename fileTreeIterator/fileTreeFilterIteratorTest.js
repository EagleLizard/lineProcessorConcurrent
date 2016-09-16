;(()=>{
  
  let fileTreeFilterIterator = require('./fileTreeFilterIterator');
  
  let tests = [
    '../testDir/subDir1',
    '../testDir/subDir1/subDir3',
    '../testDir/subDir2',
    '../testDir/subDir2/subDir4',
    '../testDir',
    '..'
  ];
  
  main();
  
  function main(){
    let testRegex = /(node_modules\/|\/\.[a-zA-Z]{1})/;
    tests.forEach((path)=>{
      console.log('\nTESTING PATH:  ', path);
      let it = fileTreeFilterIterator.getIt(path, testRegex);
      while(it.next()){
        console.log(it.value());
      }
    });
  }
  
})();