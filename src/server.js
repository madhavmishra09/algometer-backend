const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const analyzeRoute = require("./routes/analyze");
const app = express();
app.use(cors());
app.use(express.json({ limit: "50kb" }));
app.use(
  rateLimit({
    windowMs: 60 * 1000, 
    max: 30               
  })
);
app.get("/", (req, res) => {
  res.send("Algometer backend running 🚀");
});
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
app.use("/analyze", analyzeRoute);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Algometer running on port ${PORT}`);
});