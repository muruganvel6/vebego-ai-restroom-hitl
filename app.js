const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Cloud Run backend is working");
});

app.post("/analyze", (req, res) => {
  res.json({
    success: true,
    score: 95,
    issues: ["No major issue detected"],
    message: "AI review completed"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
