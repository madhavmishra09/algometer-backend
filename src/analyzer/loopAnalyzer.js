const walk = require("acorn-walk");

function analyzeLoops(ast) {

  let loopDepth = 0;
  let maxDepth = 0;
  let logLoops = 0;
  let sqrtLoops = 0;

  walk.simple(ast, {

    ForStatement(node) {

      loopDepth++;
      maxDepth = Math.max(maxDepth, loopDepth);

      // Detect logarithmic loops
      if (
        node.update &&
        node.update.type === "AssignmentExpression" &&
        node.update.operator &&
        (node.update.operator === "*=" || node.update.operator === "/=")
      ) {
        logLoops++;
      }

      // Detect sqrt loops (pattern: i*i < n)
      if (node.test && node.test.type === "BinaryExpression") {
        const testExpr = node.test;
        
        if (
          (testExpr.left?.type === "BinaryExpression" &&
           testExpr.left.operator === "*" &&
           testExpr.left.left?.name === testExpr.left.right?.name) ||
          (testExpr.right?.type === "BinaryExpression" &&
           testExpr.right.operator === "*" &&
           testExpr.right.left?.name === testExpr.right.right?.name)
        ) {
          sqrtLoops++;
        }
      }

    },

    WhileStatement() {

      loopDepth++;
      maxDepth = Math.max(maxDepth, loopDepth);

    }

  });

  return {
    loopDepth: maxDepth,
    logLoops,
    sqrtLoops
  };

}

module.exports = analyzeLoops;