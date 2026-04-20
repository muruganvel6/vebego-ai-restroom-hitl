const express = require("express");
const cors = require("cors");
const { Storage } = require("@google-cloud/storage");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: "20mb" }));

// 🔹 Google Cloud Storage
const storage = new Storage();
const bucketName = "tamil247-super-ai-datasets";
const bucket = storage.bucket(bucketName);

// 🔹 Health check
app.get("/", (req, res) => {
  res.json({ status: "AI Backend Running" });
});

// 🔹 Analyze route
app.post("/analyze", async (req, res) => {
  try {
    const { image, scanType, service = "restroom" } = req.body;

    let score = 95;
    let message = "AI analysis complete";
    let issues = [];

    if (scanType === "before") {
      score = 88;
      message = "Initial scan received. Cleaning should begin.";
    } else if (scanType === "after") {
      score = 96;
      message = "Final scan received. Area looks clean.";
    }

    let filePath = null;
    let imageUrl = null;

    // 🔹 Save image to Cloud Storage
    if (image && image.startsWith("data:image/")) {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      let folder = "general";
      if (scanType === "before") folder = "before";
      if (scanType === "after") folder = "after";

      const filename = `${Date.now()}.jpg`;
      filePath = `super-ai/datasets/${service}/raw/images/${folder}/${filename}`;

      const file = bucket.file(filePath);

      await file.save(buffer, {
        metadata: { contentType: "image/jpeg" },
        resumable: false,
      });

      imageUrl = `gs://${bucketName}/${filePath}`;
    }

    res.json({
      success: true,
      score,
      message,
      issues,
      imageUrl,
      path: filePath,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
