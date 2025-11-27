const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { analyzeCode } = require("./calc.cjs");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));

// First endpoint your frontend calls
app.post("/api/analyze", async (req, res) => {
  try {
    const code = req.body.code;
    if (!code) return res.status(400).json({ error: "No code provided" });

    const result = await analyzeCode(code);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Second fallback endpoint your frontend tries
app.post("/api/calculate", async (req, res) => {
  try {
    const code = req.body.code;
    if (!code) return res.status(400).json({ error: "No code provided" });

    const result = await analyzeCode(code);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(8080, () => {
  console.log("Server running at http://localhost:8080");
});
