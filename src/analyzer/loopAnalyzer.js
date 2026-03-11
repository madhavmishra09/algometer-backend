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

      // Detect logarithmic loops (i *= 2 or i /= 2)
      if (
        node.update &&
        node.update.type === "AssignmentExpression"
      ) {
        const op = node.update.operator;

        if (op === "*=" || op === "/=") {
          logLoops++;
        }
      }

      // Detect sqrt loops (i*i < n)
      if (
        node.test &&
        node.test.left &&
        node.test.left.type === "BinaryExpression"
      ) {
        const expr = node.test.left;

        if (
          expr.operator === "*" &&
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