// Listen for when a new tab is created
browser.tabs.onCreated.addListener(async (newTab) => {
  try {
    // Wait for a short period to allow the new tab to fully open
    setTimeout(async () => {
      // Get all open tabs
      const tabs = await browser.tabs.query({});

      // If there are multiple tabs, close the newly created one
      if (tabs.length > 1) {
        await browser.tabs.remove(newTab.id);
      }
    }, 500);  // 500ms delay, adjust as needed
  } catch (error) {
    console.error("Error while closing new tab:", error);
  }
});

// Listen for when a tab is activated (e.g., user switches to another tab)
browser.tabs.onActivated.addListener(async () => {
  try {
    // Get all open tabs
    const tabs = await browser.tabs.query({});

    // Find the active tab
    const activeTab = tabs.find((tab) => tab.active);

    // Close all other tabs except the active one
    const tabsToClose = tabs.filter((tab) => tab.id !== activeTab.id);
    for (const tab of tabsToClose) {
      await browser.tabs.remove(tab.id);
    }
  } catch (error) {
    console.error("Error while closing other tabs:", error);
  }
});

// Listen for when a tab is updated (e.g., reloaded or URL changes)
browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    // Get all open tabs
    const tabs = await browser.tabs.query({});

    // Find the active tab
    const activeTab = tabs.find((t) => t.active);

    // Close all other tabs except the active one
    const tabsToClose = tabs.filter((t) => t.id !== activeTab.id);
    for (const t of tabsToClose) {
      await browser.tabs.remove(t.id);
    }
  } catch (error) {
    console.error("Error while handling tab update:", error);
  }
});
