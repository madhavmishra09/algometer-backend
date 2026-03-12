function normalizeCode(code) {
  if (!code) return code;

  let normalized = code;

  // Remove common C/C++/Java type declarations
  const types = [
    "int",
    "long",
    "float",
    "double",
    "char",
    "bool",
    "string"
  ];

  types.forEach(type => {
    const regex = new RegExp(`\\b${type}\\s+`, "g");
    normalized = normalized.replace(regex, "let ");
  });

  // Remove semicolons after braces (harmless cleanup)
  normalized = normalized.replace(/};/g, "}");

  return normalized;
}

module.exports = normalizeCode;