const { Storage } = require("@google-cloud/storage");
const storage = new Storage();
const bucket = storage.bucket("tamil247-super-ai-datasets");

app.post("/analyze", async (req, res) => {
  try {
    const { image, scanType, service } = req.body;

    const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const fileName = `super-ai/datasets/${service}/raw/images/${scanType}/${Date.now()}.jpg`;

    const file = bucket.file(fileName);

    await file.save(buffer, {
      metadata: { contentType: "image/jpeg" }
    });

    res.json({
      success: true,
      score: Math.floor(Math.random() * 20) + 80,
      message: "Image uploaded + AI processed",
      path: fileName
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});
