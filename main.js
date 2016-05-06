;(()=>{

  var parseFlags = require('./parseFlags');

  const VALID_FLAGS = [
    '-path', //starting path, default is ./
    '-exts', //extenstions to search, will use conf file or defaults if omitted
    '-ignore', //extenstions to ignore
    '-exclude' //regex used to filter out file names
  ];

  var flagMap = parseFlags(process.argv);

  main();

  function main(){

  }

})();
