const walk=require("acorn-walk");
function analyzeBinarySearch(ast){
    let midDetected=false;
    let boundaryUpdate=false;
    let loopDetected=false;
    walk.simple(ast,{
        WhileStatement(){
            loopDetected=true;
        },
        VariableDeclaration(node){
            if(node.id.name==="mid" && node.init && node.init.type==="BinaryExpression"){
                midDetected=true;
            }
        },
        AssignmentExpression(node){
            if(node.right && node.right.type==="BinaryExpression" && node.right.left && node.right.left.name==="mid"){
                boundaryUpdate=true;
            }
        }
    });
    if(loopDetected && midDetected && boundaryUpdate){
        return true;
    }
    return false;
}

module.exports=analyzeBinarySearch;