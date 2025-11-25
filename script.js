(function() {
  const startBtn = document.getElementById('startBtn');
  const restartBtn = document.getElementById('restartBtn');
  const loadingArea = document.getElementById('loadingArea');
  const iframeWrap = document.getElementById('iframeWrap');
  const statusLine = document.getElementById('statusLine');
  const testState = document.getElementById('testState');
  const networkValue = document.getElementById('networkValue');
  const pingValue = document.getElementById('pingValue');

  // Dapatkan jenis jaringan
  function getNetworkType() {
    if (!navigator.connection) return "Unknown";
    let type = navigator.connection.type || navigator.connection.effectiveType;
    switch(type) {
      case "wifi": return "WiFi";
      case "cellular": return "Cellular";
      case "ethernet": return "Ethernet";
      default: return "Unknown";
    }
  }

  // Mengukur ping sederhana
  async function measurePing() {
    const url = "https://api.ipify.org?format=json";
    let start = performance.now();
    try {
      await fetch(url, {cache:"no-store"});
      return Math.round(performance.now() - start);
    } catch(e) {
      return null;
    }
  }

  // Refresh informasi koneksi
  async function refreshInfo() {
    networkValue.textContent = getNetworkType();
    pingValue.textContent = "…";
    let ping = await measurePing();
    pingValue.textContent = ping ? ping + " ms" : "N/A";
  }

  // Reset test
  function resetTest() {
    statusLine.textContent = "Idle";
    testState.textContent = "Idle";
    iframeWrap.classList.remove("visible");
    iframeWrap.setAttribute("aria-hidden","true");
    loadingArea.style.display = "none";
    let old = iframeWrap.querySelector("iframe");
    if(old) old.remove();
    startBtn.style.display = "inline-flex";
    restartBtn.style.display = "none";
  }

  // Event restart
  restartBtn.addEventListener("click", () => {
    resetTest();
    startBtn.click();
  });

  // Event start
  startBtn.addEventListener("click", async () => {
    startBtn.disabled = true;
    startBtn.style.opacity = "0.7";

    await refreshInfo();

    startBtn.style.display = "none";
    restartBtn.style.display = "inline-flex";

    loadingArea.style.display = "block";
    statusLine.textContent = "Connecting";
    testState.textContent = "Connecting";

    await new Promise(r => setTimeout(r,500));

    let iframe = document.createElement("iframe");
    iframe.src = "//openspeedtest.com/speedtest";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";

    iframe.addEventListener("load", () => {
      loadingArea.style.display = "none";
      iframeWrap.classList.add("visible");
      iframeWrap.setAttribute("aria-hidden","false");
      statusLine.textContent = "Running";
      testState.textContent = "Running";
    });

    iframeWrap.appendChild(iframe);
    startBtn.disabled = false;
    startBtn.style.opacity = "1";
  });

  refreshInfo();
})();