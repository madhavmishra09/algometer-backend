const { env } = process;
const fetch = (...args)=>import("node-fetch").then(({default:fetch})=>fetch(...args));
/* ------------------------- GEMINI ONLY ------------------------ */
async function callGemini(code) {
  const url = env.GEMINI_API_URL;
  const key = env.GEMINI_API_KEY;

  if (!url || !key) throw new Error("Gemini config missing");

  const prompt = `
Analyze the time and space complexity of the following code.
Respond ONLY in valid JSON like:
{"timeComplexity":"O(...)","spaceComplexity":"O(...)","notes":"short explanation"}

Code:
${code}
`;

  const res = await fetch(`${url}?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const json = await res.json();
  if (!json) throw new Error("Empty response from Gemini");

  let text =
    json?.candidates?.[0]?.content?.parts?.[0]?.text ||
    json?.output_text ||
    JSON.stringify(json);

  // Try extracting JSON cleanly
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");

  if (jsonStart !== -1 && jsonEnd > jsonStart) {
    try {
      return JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    } catch {}
  }

  return {
    timeComplexity: null,
    spaceComplexity: null,
    notes: text
  };
}

/* ------------------------- MAIN EXPORT ------------------------ */
async function analyzeCode(code) {
  // Only Gemini. No fallback.  
  return await callGemini(code);
}

module.exports = { analyzeCode };
