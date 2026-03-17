const walk = require("acorn-walk");
const getName = require("../utils/getName");

function analyzeRecursion(ast) {

  let functionName = null;
  let recursiveCalls = 0;   // ✅ FIX: declare it

  walk.simple(ast, {

    FunctionDeclaration(node) {
      functionName = node.id ? node.id.name : null;
    },

    CallExpression(node) {

      const calledName = getName(node.callee);

      if (calledName && functionName && calledName === functionName) {
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