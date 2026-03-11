const acorn=require("acorn");
function parseCode(code){
    try{
        return acorn.parse(code,{
            ecmaVersion:2020
        });
    }catch(err){
        throw new Error("Code paring failed!!");
    }
}
module.exports=parseCode;