let fileTreeIterator = require('./fileTreeIterator');
let fileUtil = require('./../fileUtil');

let tests = [
  '../testDir/subDir1',
  '../testDir/subDir1/subDir3',
  '../testDir/subDir2',
  '../testDir/subDir2/subDir4',
  '../testDir',
  '../'
];

main();

function main(){
  tests.forEach((path)=>{
    let files = [];
    console.log('\nTESTING PATH:  ', path);
    let it = fileTreeIterator.getIt(path);
    while(it.next()){
      console.log(it.value());
    }
  });
}