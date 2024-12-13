// Monitor when a new tab is created
chrome.tabs.onCreated.addListener(async (tab) => {
  const tabs = await chrome.tabs.query({}); // Get all open tabs
  if (tabs.length > 1) {
    // Close the newly created tab
    chrome.tabs.remove(tab.id);
  }
});

// Monitor when the user switches tabs or focuses on a different tab
chrome.tabs.onActivated.addListener(async () => {
  const tabs = await chrome.tabs.query({}); // Get all open tabs

  // Keep the active tab and close all others
  const activeTab = tabs.find((t) => t.active);
  tabs.forEach((t) => {
    if (t.id !== activeTab.id) {
      chrome.tabs.remove(t.id); // Close non-active tabs
    }
  });
});

// Monitor when a tab is updated (e.g., reloading or changing URL)
chrome.tabs.onUpdated.addListener(async () => {
  const tabs = await chrome.tabs.query({}); // Get all open tabs

  // Keep the active tab and close all others
  const activeTab = tabs.find((t) => t.active);
  tabs.forEach((t) => {
    if (t.id !== activeTab.id) {
      chrome.tabs.remove(t.id); // Close non-active tabs
    }
  });
});
