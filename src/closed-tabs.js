/* Fetch and display closed tabs from storage */
async function displayClosedTabs() {
    try {
        const data = await browser.storage.local.get("closedTabs");
        const closed_tabs = data.closedTabs || [];
        const list_element = document.getElementById("closed-tabs-list");

        /* Clear the list */
        list_element.innerHTML = ""; 

        /* Populate the list */
        closed_tabs.forEach((url, index) => {
            const list_item = document.createElement("li");

            /* <button> that removes link without following */
            const btn = document.createElement("button");
            btn.innerText = "x";
            btn.addEventListener("click", async () => {
                await removeTabFromList(index); 
                displayClosedTabs(); 
            });

            /* <a> element to travel back to deleted tabs */
            const link = document.createElement("a");
            link.href = url;
            link.textContent = formatUrl(url, 30); 
            link.title = url; 

            link.addEventListener("click", async (event) => {
                event.preventDefault(); 
                
                /* Redirect current tab because opening a new one would save the current one. */
                await browser.tabs.update(getActiveTab().id, { url: url }); 
                await removeTabFromList(index); 
                displayClosedTabs(); 
            });

            list_item.appendChild(btn);
            list_item.appendChild(link);
            list_element.appendChild(list_item);
        });
    } catch (error) {
        console.error("Error displaying closed tabs:", error);
    }
}

/* Get active tab */
async function getActiveTab() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
}

/* Helper function to format and truncate a URL */
function formatUrl(url, max_len) {
    /* Remove clutter: http, https, www */
    const formatted_url = url.replace(/^(https?:\/\/)?(www\.)?/, "");

    /* Truncate the URL if it exceeds the maximum length */
    if (formatted_url.length > max_len) {
        return formatted_url.slice(0, max_len) + "...";
    }
    return formatted_url;
}

/* Remove a closed tab from the list by its index */
async function removeTabFromList(index) {
    try {
        const data = await browser.storage.local.get("closedTabs");
        const closedTabs = data.closedTabs || [];

        closedTabs.splice(index, 1);
        await browser.storage.local.set({ closedTabs });
    } catch (error) {
        console.error("Error removing closed tab:", error);
    }
}

/* Load the closed tabs when the page loads */
document.addEventListener("DOMContentLoaded", displayClosedTabs);
