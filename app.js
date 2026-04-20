const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: "20mb" }));

app.get("/", (req, res) => {
  res.json({ status: "AI Backend Running" });
});

app.post("/analyze", (req, res) => {
  const { scanType } = req.body || {};

  let score = 95;
  let message = "AI review completed.";
  let issues = [];

  if (scanType === "before") {
    score = 88;
    message = "Initial scan received. Floor safety and cleaning tasks should begin.";
  } else if (scanType === "after") {
    score = 96;
    message = "Final scan received. Area looks improved and ready for supervisor review.";
  }

  res.json({ success: true, score, issues, message });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
