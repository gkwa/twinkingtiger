import "./styles/popup.css"

// State management
let isRunning = false

// DOM elements
const startBtn = document.getElementById("startBtn")
const stopBtn = document.getElementById("stopBtn")
const statusEl = document.getElementById("status")
const tabDelayEl = document.getElementById("tabDelay")
const roundsEl = document.getElementById("rounds")

// Load saved settings when popup opens
function loadSavedSettings() {
  chrome.storage.local.get(["tabDelay", "rounds"], (result) => {
    if (result.tabDelay !== undefined) {
      tabDelayEl.value = result.tabDelay
    }
    if (result.rounds !== undefined) {
      roundsEl.value = result.rounds
    }
  })
}

// Save settings whenever they change
function saveSettings() {
  const tabDelay = parseFloat(tabDelayEl.value) || 5
  const rounds = parseInt(roundsEl.value) || 1

  chrome.storage.local.set({
    tabDelay: tabDelay,
    rounds: rounds,
  })
}

// Add event listeners to save settings on change
tabDelayEl.addEventListener("change", saveSettings)
roundsEl.addEventListener("change", saveSettings)

// Get current state when popup opens
chrome.runtime.sendMessage({ action: "getState" }, (response) => {
  if (response && response.isRunning) {
    updateUI(true)
    tabDelayEl.value = response.tabDelay
    roundsEl.value = response.rounds
    statusEl.textContent = `Running: ${response.currentRound}/${response.rounds === 0 ? "∞" : response.rounds}`
  } else {
    // Only load saved settings if not currently running
    loadSavedSettings()
  }
})

// Start button click handler
startBtn.addEventListener("click", () => {
  const tabDelay = parseFloat(tabDelayEl.value) || 5
  const rounds = parseInt(roundsEl.value) || 1

  // Save settings when starting
  saveSettings()

  chrome.runtime.sendMessage(
    {
      action: "start",
      tabDelay: tabDelay,
      rounds: rounds,
    },
    () => {
      updateUI(true)
      statusEl.textContent = `Running: 1/${rounds === 0 ? "∞" : rounds}`
    },
  )
})

// Stop button click handler
stopBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "stop" }, () => {
    updateUI(false)
  })
})

// Update UI based on current state
function updateUI(running) {
  isRunning = running
  startBtn.disabled = running
  stopBtn.disabled = !running
  tabDelayEl.disabled = running
  roundsEl.disabled = running

  if (!running) {
    statusEl.textContent = "Not running"
  }
}
