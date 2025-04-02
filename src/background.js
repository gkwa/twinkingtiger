// State management
let cycleState = {
  isRunning: false,
  tabDelay: 5,
  rounds: 1,
  currentRound: 0,
  tabIds: [],
  currentTabIndex: 0,
  timerId: null,
}

// Load saved settings when background script starts
chrome.storage.local.get(["tabDelay", "rounds"], (result) => {
  if (result.tabDelay !== undefined) {
    cycleState.tabDelay = result.tabDelay
  }
  if (result.rounds !== undefined) {
    cycleState.rounds = result.rounds
  }
})

// Setup message listeners
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "start") {
    startCycling(message.tabDelay, message.rounds)
    sendResponse({ success: true })
  } else if (message.action === "stop") {
    stopCycling()
    sendResponse({ success: true })
  } else if (message.action === "getState") {
    sendResponse({
      isRunning: cycleState.isRunning,
      tabDelay: cycleState.tabDelay,
      rounds: cycleState.rounds,
      currentRound: cycleState.currentRound,
    })
  }
  return true // Keep the message channel open for async response
})

// Start the tab cycling process
function startCycling(tabDelay, rounds) {
  // Initialize cycling state
  cycleState.isRunning = true
  cycleState.tabDelay = tabDelay
  cycleState.rounds = rounds
  cycleState.currentRound = 1

  // Get all tabs in current window
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    cycleState.tabIds = tabs.map((tab) => tab.id)

    if (cycleState.tabIds.length <= 1) {
      console.log("Not enough tabs to cycle (need at least 2)")
      cycleState.isRunning = false
      return
    }

    // Start from the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
      if (activeTabs.length > 0) {
        const activeTabId = activeTabs[0].id
        const activeTabIndex = cycleState.tabIds.indexOf(activeTabId)

        if (activeTabIndex !== -1) {
          cycleState.currentTabIndex = activeTabIndex
        } else {
          cycleState.currentTabIndex = 0
        }

        // Start cycling
        cycleToNextTab()
      }
    })
  })
}

// Move to the next tab in the cycle
function cycleToNextTab() {
  if (!cycleState.isRunning) return

  // Update index to next tab
  cycleState.currentTabIndex = (cycleState.currentTabIndex + 1) % cycleState.tabIds.length

  // If we've completed a round
  if (cycleState.currentTabIndex === 0) {
    // If we've completed all rounds
    if (cycleState.rounds > 0 && cycleState.currentRound >= cycleState.rounds) {
      stopCycling()
      return
    }

    // Start next round
    if (cycleState.rounds > 0) {
      cycleState.currentRound++
    }
  }

  // Switch to the next tab
  const nextTabId = cycleState.tabIds[cycleState.currentTabIndex]
  chrome.tabs.update(nextTabId, { active: true }, () => {
    // Schedule the next tab switch (convert seconds to milliseconds)
    cycleState.timerId = setTimeout(cycleToNextTab, cycleState.tabDelay * 1000)
  })
}

// Stop the tab cycling process
function stopCycling() {
  if (cycleState.timerId) {
    clearTimeout(cycleState.timerId)
    cycleState.timerId = null
  }

  cycleState.isRunning = false
}
