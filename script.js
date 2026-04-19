let video;
let canvas;
let context;

let beforeImage = null;
let afterImage = null;
let points = 0;

window.addEventListener("DOMContentLoaded", async () => {
  video = document.getElementById("video");
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  await startCamera();
});

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });
    video.srcObject = stream;
  } catch (error) {
    console.error("Camera error:", error);
    updateResult("Camera access failed.");
  }
}

function startWork() {
  document.getElementById("sessionStatus").innerText = "Work started";
  updateResult("Work session started. Camera ready.");
}

function capture(type) {
  if (!video.videoWidth || !video.videoHeight) {
    updateResult("Camera not ready yet.");
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = canvas.toDataURL("image/jpeg", 0.8);

  if (type === "before") {
    beforeImage = imageData;
    updateResult("Before scan captured.");
  } else {
    afterImage = imageData;
    updateResult("After scan captured.");
  }
}

async function sendToAISupervisor(type) {
  const image = type === "before" ? beforeImage : afterImage;

  if (!image) {
    updateResult(`No ${type} image captured yet.`);
    return;
  }

  try {
    const response = await fetch("/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        scanType: type,
        image
      })
    });

    const data = await response.json();

    document.getElementById("scoreValue").innerText = data.score ?? 0;
    updateResult(data.message || "AI supervisor response received.");
  } catch (error) {
    console.error(error);
    updateResult("Failed to send image to AI supervisor.");
  }
}

async function runAIScan() {
  const image = afterImage || beforeImage;

  if (!image) {
    updateResult("Capture an image before running AI scan.");
    return;
  }

  try {
    const response = await fetch("/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        scanType: "loop",
        image
      })
    });

    const data = await response.json();

    document.getElementById("scoreValue").innerText = data.score ?? 0;
    updateResult(data.message || "AI scan completed.");

    points += 10;
    document.getElementById("pointsValue").innerText = `${points} Points`;
  } catch (error) {
    console.error(error);
    updateResult("AI scan failed.");
  }
}

function submitReport() {
  const damage = document.getElementById("damageReport").value;
  const sustainability = document.getElementById("sustainabilityReport").value;
  const wasteKg = document.getElementById("wasteKg").value;

  const materials = [...document.querySelectorAll('.materials-grid input[type="checkbox"]:checked')]
    .map(input => input.value);

  console.log({
    damage,
    sustainability,
    wasteKg,
    materials
  });

  updateResult("Report submitted successfully.");
}

function submitIdea() {
  const idea = document.getElementById("workerIdeas").value;
  console.log({ idea });
  updateResult("Idea submitted. Thank you for improving the system.");
}

function updateResult(message) {
  document.getElementById("result").innerText = message;
}
