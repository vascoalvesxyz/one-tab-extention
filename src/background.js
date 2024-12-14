/* Save tab URLs to storage */
async function saveTab(url) {
    try {
        /* Get the existing list of closed tabs */
        const data = await browser.storage.local.get("closedTabs");
        const closedTabs = data.closedTabs || [];

        /* Push the new URL to the list */
        if (!closedTabs.includes(url)) {
            closedTabs.push(url);
            await browser.storage.local.set({ closedTabs });
        }
    } catch (error) {
        console.error("Error saving closed tab:", error);
    }
}

/* Save and close tab */
async function saveAndCloseTab(tab) {
    const url = tab.url || "New Tab";
    await saveTab(url);
    await browser.tabs.remove(tab.id);
}

/* Closes all non-active tabs */
async function closeAllOtherTabs() {
    try {
        /* Get all open tabs */
        const tabs = await browser.tabs.query({});

        /* Find the active tab */
        const activeTab = tabs.find((tab) => tab.active);

        /* Close all other tabs except the active one */
        const tabsToClose = tabs.filter((tab) => tab.id !== activeTab.id);
        for (const tab of tabsToClose) {
            await saveAndCloseTab(tab);
        }

    } catch (error) {
        console.error("Error while closing other tabs:", error);
    }
}

/* Listener: On Tab Creation */
browser.tabs.onCreated.addListener(async (newTab) => {
    try {
        setTimeout(async () => {
            const tabs = await browser.tabs.query({});
            if (tabs.length > 1) {
                await saveAndCloseTab(newTab);
            }
        }, 500);
    } catch (error) {
        console.error("Error while closing new tab:", error);
    }
});

/* Listener: On tab activation (e.g., user switches to another tab) */
browser.tabs.onActivated.addListener(async () => {
    closeAllOtherTabs();
});

/*  Listener: Tab is updated */
browser.tabs.onUpdated.addListener(async () => {
    closeAllOtherTabs();
});
