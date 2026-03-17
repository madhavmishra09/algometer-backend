const express = require("express");

const validateInput = require("../utils/validateInput");
const cache = require("../utils/cache");

const parseCode = require("../parser/parseCode");
const normalizeCode = require("../utils/normalizeCode");

const analyzeLoops = require("../analyzer/loopAnalyzer");
const analyzeRecursion = require("../analyzer/recursionAnalyzer");
const analyzeSpace = require("../analyzer/spaceAnalyzer");

const analyzeBinarySearch = require("../analyzer/binarySearchAnalyzer");
const analyzeDivideConquer = require("../analyzer/divideConquerAnalyzer");

const reduceComplexity = require("../analyzer/complexityReducer");

const router = express.Router();

router.post("/", (req, res) => {

  const { code } = req.body;

  // ---------------------------
  // Input validation
  // ---------------------------
  const error = validateInput(code);
  if (error) {
    return res.status(400).json({ error });
  }

  // ---------------------------
  // Cache check
  // ---------------------------
  if (cache.has(code)) {
    return res.json(cache.get(code));
  }

  try {

    // ---------------------------
    // Normalize code (C++ → JS)
    // ---------------------------
    const cleanedCode = normalizeCode(code);

    // ---------------------------
    // Parse AST
    // ---------------------------
    const ast = parseCode(cleanedCode);

    // ---------------------------
    // SAFE analyzers (no crash)
    // ---------------------------
    let loopData = { loopDepth: 0, logLoops: 0, sqrtLoops: 0 };
    let recursionData = { recursion: false };

    try {
      loopData = analyzeLoops(ast);
    } catch (e) {
      console.error("Loop analyzer error:", e);
    }

    try {
      recursionData = analyzeRecursion(ast);
    } catch (e) {
      console.error("Recursion analyzer error:", e);
    }

    // ---------------------------
    // Pattern detection
    // ---------------------------
    let isBinarySearch = false;
    let isDivideConquer = false;

    try {
      isBinarySearch = analyzeBinarySearch(ast);
    } catch (e) {
      console.error("Binary search analyzer error:", e);
    }

    try {
      isDivideConquer = analyzeDivideConquer(ast);
    } catch (e) {
      console.error("Divide & conquer analyzer error:", e);
    }

    // ---------------------------
    // Compute complexity
    // ---------------------------
    let timeComplexity = reduceComplexity(
      loopData.loopDepth,
      loopData.logLoops,
      loopData.sqrtLoops
    );

    if (isDivideConquer) {
      timeComplexity = "O(n log n)";
    } else if (isBinarySearch) {
      timeComplexity = "O(log n)";
    }

    let spaceComplexity = "O(1)";

    try {
      spaceComplexity = analyzeSpace(ast);
    } catch (e) {
      console.error("Space analyzer error:", e);
    }

    // ---------------------------
    // Final result
    // ---------------------------
    const result = {
      time_complexity: timeComplexity,
      space_complexity: spaceComplexity,
      loops_detected: loopData.loopDepth,
      recursion: recursionData.recursion,
      binary_search: isBinarySearch,
      divide_and_conquer: isDivideConquer
    };

    // Cache result
    cache.set(code, result);

    // Send response
    res.json(result);

  } catch (err) {

    console.error("Analysis error:", err);

    res.status(400).json({
      error: "Code analysis failed",
      details: err.message
    });

  }

});

module.exports = router;