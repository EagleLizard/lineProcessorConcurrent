;(()=>{
  
  let fileLineAction = require('./fileLineAction');
  
  let testStrings = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six'
  ];
  
  let testActions = [
    fileLineAction.getAction(str=>(()=>str.length),
                             strs=>(strs.reduce((acc,curr)=>(acc+=curr,acc),0))),
    fileLineAction.getAction(str=>(()=>str.charAt(0)),
                             strs=>(strs.join(''))),
    fileLineAction.getAction(str=>(()=>str.split('').reduce((acc,curr)=>(acc+=curr.charCodeAt(0),acc),0)),
                             strs=>(strs.reduce((acc,curr)=>(acc+=curr,acc),0))),
    fileLineAction.getAction(str=>(()=>str.split('').reverse().join('')),
                             strs=>strs.reverse().join(''))
  ];
  
  main();
  
  function main(){
    testStrings.forEach(str=>{
      testActions.forEach(action=>{
        action.add(str);
      });
    });
    console.log(testActions.map(action=>action.execute()));
  }
  
})();