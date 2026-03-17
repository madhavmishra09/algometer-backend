const walk = require("acorn-walk");
const getName = require("../utils/getName");

function analyzeBinarySearch(ast) {

  let midDetected = false;
  let boundaryUpdate = false;
  let loopDetected = false;

  walk.simple(ast, {

    WhileStatement() {
      loopDetected = true;
    },

    VariableDeclarator(node) {

      if (
        node.id &&
        node.id.name === "mid"
      ) {
        midDetected = true;
      }

    },

    AssignmentExpression(node) {

      const leftName = getName(node.left);

      if (leftName === "l" || leftName === "r") {
        boundaryUpdate = true;
      }

    }

  });

  return loopDetected && midDetected && boundaryUpdate;
}

module.exports = analyzeBinarySearch;