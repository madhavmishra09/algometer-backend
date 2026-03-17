const walk = require("acorn-walk");
function analyzeRecursion(ast) {
    const getName = require("../utils/getName");

    walk.simple(ast, {

        FunctionDeclaration(node) {
            functionName = node.id ? node.id.name : null;
        },

        CallExpression(node) {

            const calledName = getName(node.callee);

            if (calledName && calledName === functionName) {
                recursiveCalls++;
            }

        }

    });
    return {
        recursion: recursiveCalls > 0,
        calls: recursiveCalls
    };
}

module.exports = analyzeRecursion;