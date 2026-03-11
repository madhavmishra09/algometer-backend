const walk=require("acorn-walk");
function analyzeSpace(ast){
    let arrays=0;
    walk.simple(ast,{
        NewExpression(node){
            if(node.callee.name==="Array"){
                arrays++;
            }
        }
    });
    if(arrays>0){
        return "O(n)";
    }
    return "O(1)"
}

module.exports=analyzeSpace;