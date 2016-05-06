;(()=>{

  var _ = require('lodash');

  module.exports = parseFlags;

  //returns a map where the key is the flag
  function parseFlags(argv){
    if(argv.length <3) return;
    argv = argv.slice(2);
    var mapIt, mapItCurr;
    var flags = new Map();
    var lastFlag = null;
    var flagRegex = /^\-[a-z]+$/g;

    _.forEach(argv, (val)=>{
      val = val.trim();
      if(flagRegex.exec(val)!==null && !flags.has(val)){
        flags.set(val,[]);//init flags as an array
        lastFlag = val;
      }else if(lastFlag!==null){
        flags.get(lastFlag).push(val);
      }
    });

    flags.forEach((val, key)=>{
      flags.set(key,val.join(' '));
    });

    return flags;

  }

})();
