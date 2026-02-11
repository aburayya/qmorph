const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Load CSV into memory
const MORPH = {};

fs.createReadStream("qac.csv")
  .pipe(csv())
  .on("data", (row) => {
    const token = row.token?.trim();
    const root = row.root?.trim();
    if (token) MORPH[token] = root;
  })
  .on("end", () => {
    console.log("QAC CSV loaded.");
  });

// Analyze endpoint
app.post("/analyze", (req, res) => {
  const text = req.body.text || "";
  const words = text.split(/\s+/).filter(Boolean);

  const results = words.map((w) => ({
    word: w,
    root: MORPH[w] || null,
  }));

  res.json(results);
});

// Home
app.get("/", (req, res) => {
  res.json({ message: "Node.js Morphology API running" });
});

// Start server
app.listen(3000, () => {
  console.log("Morphology API running on http://localhost:3000");
});