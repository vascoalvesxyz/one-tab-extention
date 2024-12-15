/* Save tab URLs to storage */
async function saveTab(url) {
    try {
        /* Get the existing list of closed tabs */
        const data = await new Promise((resolve, reject) => {
            chrome.storage.local.get("closedTabs", (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(result);
                }
            });
        });

        const closedTabs = data.closedTabs || [];

        /* Push the new URL to the list */
        if (!closedTabs.includes(url)) {
            closedTabs.push(url);
            await new Promise((resolve, reject) => {
                chrome.storage.local.set({ closedTabs }, () => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve();
                    }
                });
            });
        }
    } catch (error) {
        console.error("Error saving closed tab:", error);
    }
}

/* Save and close tab */
async function saveAndCloseTab(tab) {
    const url = tab.url || "New Tab";
    await saveTab(url);
    chrome.tabs.remove(tab.id);
}

/* Closes all non-active tabs */
async function closeAllOtherTabs() {
    try {
        /* Get all open tabs */
        chrome.tabs.query({}, async (tabs) => {
            /* Find the active tab */
            const activeTab = tabs.find((tab) => tab.active);

            /* Close all other tabs except the active one */
            const tabsToClose = tabs.filter((tab) => tab.id !== activeTab.id);
            for (const tab of tabsToClose) {
                await saveAndCloseTab(tab);
            }
        });

    } catch (error) {
        console.error("Error while closing other tabs:", error);
    }
}

/* Listener: On Tab Creation */
chrome.tabs.onCreated.addListener(async (newTab) => {
    try {
        setTimeout(async () => {
            chrome.tabs.query({}, (tabs) => {
                if (tabs.length > 1) {
                    saveAndCloseTab(newTab);
                }
            });
        }, 500);
    } catch (error) {
        console.error("Error while closing new tab:", error);
    }
});

/* Listener: On tab activation (e.g., user switches to another tab) */
chrome.tabs.onActivated.addListener(async () => {
    closeAllOtherTabs();
});

/*  Listener: Tab is updated */
chrome.tabs.onUpdated.addListener(async () => {
    closeAllOtherTabs();
});
