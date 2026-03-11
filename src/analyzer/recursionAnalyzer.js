const walk=require("acorn-walk");
function analyzeRecursion(ast){
    let recursiveCalls=0;
    let functionName=null;
    walk.simple(ast,{
        FunctionDeclaration(node){
            functionName=node.id.name;
        },
        CallExpression(node){
            if(node.callee.name===functionName){
                recursiveCalls++;
            }
        }
    });
    return{
        recursion:recursiveCalls>0,
        calls:recursiveCalls
    };
}

module.exports=analyzeRecursion;