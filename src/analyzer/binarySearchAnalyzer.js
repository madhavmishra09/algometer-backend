const walk = require("acorn-walk");

function analyzeBinarySearch(ast) {

  let hasWhile = false;
  let hasMid = false;
  let updatesBoundary = false;

  walk.simple(ast, {

    WhileStatement() {
      hasWhile = true;
    },

    VariableDeclarator(node) {
      if (
        node.id &&
        node.id.name === "mid"
      ) {
        hasMid = true;
      }
    },

    AssignmentExpression(node) {

      if (
        node.right &&
        node.right.type === "BinaryExpression" &&
        node.right.left &&
        node.right.left.name === "mid"
      ) {
        updatesBoundary = true;
      }

    }

  });

  return hasWhile && hasMid && updatesBoundary;
}

module.exports = analyzeBinarySearch;