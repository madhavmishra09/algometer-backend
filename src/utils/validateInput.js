function validateInput(code){
    if(!code|typeof code !=="string"){
        return "Cdde must be a string";
    }
    const lines=code.split("\n");
    if(lines.length>300){
        return "Code too long (max 300 lines)";
    }
    if(code.length>50000){
        return "Code size exceeded";
    }
    return null;
}

module.exports=validateInput;