function reduceComplexity(loopDepth, logLoops, sqrtLoops) {

  if (sqrtLoops > 0) {
    return "O(√n)";
  }

  if (logLoops > 0 && loopDepth > 0) {
    return "O(n log n)";
  }

  if (logLoops > 0) {
    return "O(log n)";
  }

  if (loopDepth === 0) {
    return "O(1)";
  }

  if (loopDepth === 1) {
    return "O(n)";
  }

  return `O(n^${loopDepth})`;
}

module.exports = reduceComplexity;