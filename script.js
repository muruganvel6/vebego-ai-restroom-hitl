async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });

    const video = document.getElementById("video");
    video.srcObject = stream;
    video.play();

    console.log("Camera started");
  } catch (err) {
    console.error("Camera error:", err);
    alert("Camera access failed. Open via HTTPS (Cloud Run).");
  }
}
function captureImage() {
  const canvas = document.createElement("canvas");
  const video = document.getElementById("video");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  return canvas.toDataURL("image/jpeg");
}
async function sendScan(type) {
  const image = captureImage();

  const res = await fetch("/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      scanType: type,
      image: image,
      service: "restroom"
    })
  });

  const data = await res.json();

  document.getElementById("score").innerText = data.score;
  document.getElementById("status").innerText = data.message;
}
