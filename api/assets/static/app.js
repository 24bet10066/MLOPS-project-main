const textInput = document.querySelector("#review-text");
const analyzeButton = document.querySelector("#analyze-button");
const charCount = document.querySelector("#char-count");
const formError = document.querySelector("#form-error");
const resultContent = document.querySelector("#result-content");
const emptyState = document.querySelector("#empty-state");
const resultHeading = document.querySelector("#result-heading");
const resultBadge = document.querySelector("#result-badge");
const sentimentLabel = document.querySelector("#sentiment-label");
const sentimentIcon = document.querySelector("#sentiment-icon");
const confidenceValue = document.querySelector("#confidence-value");
const probabilities = document.querySelector("#probabilities");
const connectionStatus = document.querySelector("#connection-status");
const statusLabel = document.querySelector("#status-label");

const labelNames = { positive: "Positive", negative: "Negative", neutral: "Neutral" };
const labelIcons = { positive: "↗", negative: "↘", neutral: "—" };

function setError(message = "") {
  formError.textContent = message;
  formError.classList.toggle("visible", Boolean(message));
}

function updateCount() {
  charCount.textContent = textInput.value.length.toLocaleString();
}

function setConnection(ready) {
  connectionStatus.classList.toggle("offline", !ready);
  statusLabel.textContent = ready ? "Model online" : "Model unavailable";
}

function renderProbabilities(values) {
  probabilities.innerHTML = Object.entries(values)
    .map(([label, value]) => {
      const percent = Math.round(Number(value) * 100);
      const name = labelNames[label] || label;
      return `<div class="probability-row">
        <div class="probability-heading"><span>${name}</span><strong>${percent}%</strong></div>
        <div class="progress-track"><div class="progress-value ${label}" style="width: ${percent}%"></div></div>
      </div>`;
    })
    .join("");
}

function showResult(data) {
  const label = String(data.label || "neutral").toLowerCase();
  const readableLabel = labelNames[label] || label;
  const confidence = Math.max(...Object.values(data.probabilities || {}).map(Number), 0);
  resultHeading.textContent = "Sentiment detected";
  resultBadge.textContent = readableLabel.toUpperCase();
  resultBadge.className = `result-badge ${label}`;
  sentimentLabel.textContent = readableLabel;
  sentimentLabel.className = `sentiment-label ${label}`;
  sentimentIcon.textContent = labelIcons[label] || "✦";
  sentimentIcon.className = `sentiment-icon ${label}`;
  confidenceValue.textContent = `${Math.round(confidence * 100)}%`;
  renderProbabilities(data.probabilities || {});
  emptyState.classList.add("hidden");
  resultContent.classList.remove("hidden");
}

async function analyze() {
  const text = textInput.value.trim();
  setError("");
  if (!text) {
    setError("Add a review before analyzing.");
    textInput.focus();
    return;
  }
  analyzeButton.disabled = true;
  analyzeButton.classList.add("loading");
  analyzeButton.querySelector("span").textContent = "Analyzing...";
  try {
    const response = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "The review could not be analyzed.");
    showResult(data);
  } catch (error) {
    setError(error.message || "Connection error. Please try again.");
  } finally {
    analyzeButton.disabled = false;
    analyzeButton.classList.remove("loading");
    analyzeButton.querySelector("span").textContent = "Analyze sentiment";
  }
}

async function loadModelDetails() {
  try {
    const [healthResponse, modelResponse] = await Promise.all([fetch("/health"), fetch("/model")]);
    if (!healthResponse.ok || !modelResponse.ok) throw new Error("Model unavailable");
    const model = await modelResponse.json();
    setConnection(true);
    document.querySelector("#model-type").textContent = model.model_type || "Sentiment model";
    document.querySelector("#model-labels").textContent = (model.labels || []).map((label) => labelNames[label] || label).join(" · ");
    document.querySelector("#model-c").textContent = model.best_C ?? "—";
  } catch {
    setConnection(false);
    document.querySelector("#model-type").textContent = "Unavailable";
    document.querySelector("#model-labels").textContent = "—";
  }
}

textInput.addEventListener("input", updateCount);
textInput.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") analyze();
});
analyzeButton.addEventListener("click", analyze);
document.querySelectorAll(".example-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    textInput.value = chip.dataset.example;
    updateCount();
    textInput.focus();
  });
});
updateCount();
loadModelDetails();
