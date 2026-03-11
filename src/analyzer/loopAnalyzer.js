const walk=require("acorn-walk");
function analyzeLoops(ast){
    let currentDepth=0;
    let maxDepth=0;
    let logLoops=0;
    walk.simple(ast,{
        ForStatement(node){
            currentDepth++;
            maxDepth=max(maxDepth,currentDepth);
            if(node.update && node.update.operator && (node.update.operator==="*="||node.update.operator==="/=")){
                logLoops++;
            }
            currentDepth--;
        },
        WhileStatement(){
            currentDepth++;
            maxDepth=Math.max(maxDepth,currentDepth);
            currentDepth--;
    }
    });
    return{
        loopDepth:maxDepth,
        logLoops
    };
}

module.exports=analyzeLoops;