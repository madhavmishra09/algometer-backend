const { env } = process;
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

/* ------------------------- COMMENT REMOVAL ------------------------ */
function removeComments(code) {
  return code
    .replace(/\/\[\s\S]?\*\//g, "")      // block comments
    .replace(/\/\/.*/g, "")               // single-line comments
    .replace(/#.*/g, "")                  // python/bash comments
    .replace(/<!--[\s\S]*?-->/g, "")      // html comments
    .replace(/'''[\s\S]*?'''/g, "")       // python triple '
    .replace(/"""[\s\S]*?"""/g, "")       // python triple "
    .replace(/^\s*[\r\n]/gm, "")          // empty lines
    .trim();
}

/* ------------------------- GEMINI CALL ------------------------ */
async function callGemini(code) {
  const url = env.GEMINI_API_URL;
  const key = env.GEMINI_API_KEY;

  if (!url || !key) throw new Error("Gemini config missing");

  const cleaned = removeComments(code);

  const prompt = `
You are AlgoMeter, an expert in algorithmic analysis.

Analyze the TIME and SPACE complexity of the following code or pseudocode.
The code may be incomplete, any language, or just an algorithm snippet.

Your task:
- Understand the logic (NOT comments)
- Identify loops, recursion, data structures
- Compute Big-O time & space
- Give a SHORT explanation

IMPORTANT:
Respond ONLY with VALID JSON EXACTLY like:
{"timeComplexity":"O(...)","spaceComplexity":"O(...)","notes":"short explanation"}

Code (comments removed):
${cleaned}
`;

  const res = await fetch(`${url}?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const data = await res.json();
  if (!data) throw new Error("Empty response from Gemini");

  let text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    data?.candidates?.[0]?.output_text ||
    JSON.stringify(data);

  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");

  if (jsonStart !== -1 && jsonEnd !== -1) {
    try {
      return JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    } catch (e) {
      console.error("JSON parse error:", e);
    }
  }

  return {
    timeComplexity: "O(?)",
    spaceComplexity: "O(?)",
    notes: "Model returned unstructured output."
  };
}

/* ------------------------- EXPORT ------------------------ */
async function analyzeCode(code) {
  return await callGemini(code);
}

module.exports = { analyzeCode };