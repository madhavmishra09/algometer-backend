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

      // Detect sqrt loops
      if (
        node.test &&
        node.test.left &&
        node.test.left.type === "BinaryExpression"
      ) {

        const expr = node.test.left;

        if (
          expr &&
          expr.operator === "*" &&
          expr.left &&
          expr.right &&
          expr.left.name &&
          expr.right.name &&
          expr.left.name === expr.right.name
        ) {
          sqrtLoops++;
        }

      }

      loopDepth--;

    },

    WhileStatement() {

      loopDepth++;
      maxDepth = Math.max(maxDepth, loopDepth);
      loopDepth--;

    }

  });

  return {
    loopDepth: maxDepth,
    logLoops,
    sqrtLoops
  };

}

module.exports = analyzeLoops;