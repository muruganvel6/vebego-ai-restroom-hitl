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
