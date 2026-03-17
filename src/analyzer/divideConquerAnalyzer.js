const walk = require("acorn-walk");

function analyzeDivideConquer(ast) {

  let functionName = null;
  let recursiveCalls = 0;
  let hasDivide = false;

  walk.simple(ast, {

    FunctionDeclaration(node) {
      functionName = node.id ? node.id.name : null;
    },

    CallExpression(node) {

      if (
        node.callee &&
        node.callee.name &&
        node.callee.name === functionName
      ) {
        recursiveCalls++;
      }

    },

    BinaryExpression(node) {

      // detect n/2 pattern
      if (
        node.operator === "/" &&
        node.right &&
        node.right.value === 2
      ) {
        hasDivide = true;
      }

    }

  });

  return recursiveCalls >= 2 && hasDivide;
}

module.exports = analyzeDivideConquer;