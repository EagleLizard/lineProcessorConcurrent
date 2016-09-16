/*
  This is used for constructing objects that perform an action line-by-line.
    The fileProcessor will accept a lineAction object and call the execute() 
    method on the fileLine. Related actions will be executed together.
  Contsruct the action with a callback that returns either a queuable 
    function to call or null for NOOP. All actions will be executed in 
    order when execute is called. To manage state accross actions, compose
    the action to have a reference in it's callback to a state object.
 */
;(()=>{
  
  module.exports = {
    getAction: getAction
  };
  
  function getAction(callback, final){
    return new FileLineAction(callback, final);
  }
  
  function FileLineAction(callback, final){
    
    let actions = [];
    
    this.add = add;
    this.execute = execute;
    
    function add(string){
      actions.push(callback(string));
    }
    
    function execute(){
      let results = actions.map(fun=>fun());
      actions.length=0;
      return final?final(results):results;
    }
    
  }
  
})();
  
