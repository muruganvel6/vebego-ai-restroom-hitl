const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ✅ Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// ✅ Load index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ AI API
app.post("/scan", (req, res) => {
  res.json({
    score: Math.floor(Math.random() * 100),
    status: "AI OK"
  });
});

// ✅ Cloud Run port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
