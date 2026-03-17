function getName(node) {
  if (!node) return null;

  // simple identifier
  if (node.type === "Identifier") {
    return node.name;
  }

  // handle arr[i] → MemberExpression
  if (node.type === "MemberExpression") {
    if (node.object && node.object.name) {
      return node.object.name;
    }
  }

  return null;
}

module.exports = getName;