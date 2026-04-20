async function sendAI() {
  const res = await fetch("/scan", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ image: "test" })
  });

  const data = await res.json();

  document.getElementById("overlayBox").innerText =
    "AI Score: " + data.score + "%";
}
