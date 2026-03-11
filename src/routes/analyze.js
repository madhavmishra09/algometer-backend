const express = require("express");

const validateInput = require("../utils/validateInput");
const cache = require("../utils/cache");

const parseCode = require("../parser/parseCode");

const analyzeLoops = require("../analyzer/loopAnalyzer");
const analyzeRecursion = require("../analyzer/recursionAnalyzer");
const analyzeSpace = require("../analyzer/spaceAnalyzer");

const reduceComplexity = require("../analyzer/complexityReducer");
const analyzeBinarySearch = require("../analyzer/binarySearchAnalyzer");
const analyzeDivideConquer = require("../analyzer/divideConquerAnalyzer");

const router = express.Router();

router.post("/", (req, res) => {

  const { code } = req.body;

  const error = validateInput(code);
  if (error) {
    return res.status(400).json({ error });
  }

  if (cache.has(code)) {
    return res.json(cache.get(code));
  }

  try {

    const ast = parseCode(code);

    const loopData = analyzeLoops(ast);
    const recursionData = analyzeRecursion(ast);

    const isBinarySearch = analyzeBinarySearch(ast);
    const isDivideConquer = analyzeDivideConquer(ast);

    let timeComplexity = reduceComplexity(
      loopData.loopDepth,
      loopData.logLoops
    );

    if (isDivideConquer) {
      timeComplexity = "O(n log n)";
    } else if (isBinarySearch) {
      timeComplexity = "O(log n)";
    }

    const spaceComplexity = analyzeSpace(ast);

    const result = {
      time_complexity: timeComplexity,
      space_complexity: spaceComplexity,
      loops_detected: loopData.loopDepth,
      recursion: recursionData.recursion,
      binary_search: isBinarySearch,
      divide_and_conquer: isDivideConquer
    };

    cache.set(code, result);

    res.json(result);

  } catch (err) {

    res.status(400).json({
      error: "Code analysis failed"
    });

  }

});

module.exports = router;