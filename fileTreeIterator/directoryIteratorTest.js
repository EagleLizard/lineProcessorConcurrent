
let directoryIterator = require('./directoryIterator');

let tests = [
  '../testDir'
];

main();

function main(){
  tests.forEach((path)=>{
    let it = directoryIterator.getIt(path);
    while(!it.isDone()){
      it.next();
      console.log(it.getCurrentFullPath(), ' - '+((it.currentIsFile()&&'file')||(it.currentIsDir()&&'dir')));
    }
  });
}