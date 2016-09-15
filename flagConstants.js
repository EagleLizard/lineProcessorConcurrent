;(()=>{

  module.exports = {
    'PATH':'-p', //starting path, default is ./
    'EXTENSIONS':'-ext', //extenstions to search, will use conf file or defaults if omitted
    'IGNORES':'-ignore', //extenstions to ignore
    'EXCLUDERX':'-exc', //regex used to filter out file names
    'FORCESYNC':'-sync' //force the code to run synchronously
  };

})();
