function reduceComplexity(loopDepth,logLoops){
    let result="O(";
    if(loopDepth===0 && logLoops===0){
        return "O(1)";
    }
    if(loopDepth>0){
        result+=`n${loopDepth>1?"^"+loopDepth: ""}`;
    }
    if(logLoops>0){
        result+=`${loopDepth? " " : ""}log n`;
    }
    result+=")";
    return result;
}

module.exports=reduceComplexity;