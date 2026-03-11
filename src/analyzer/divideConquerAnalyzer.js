const walk=require("acorn-walk");
function analyzeDivideConquer(ast){
    let functionName=null;
    let recursiveCalls=0;
    walk.simple(ast,{
        FunctionDeclaration(node){
            functionName=node.id.name;
        },
        CallExpression(node){
            if(node.callee && node.callee===functionName){
                recursiveCalls++;
            }
        }
    });
    if(recursiveCalls>=2){
        return true;
    }
    return false;
}

module.exports=analyzeDivideConquer;