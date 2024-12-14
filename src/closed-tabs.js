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

            const link = document.createElement("a");
            link.href = url;
            link.textContent = formatUrl(url, 30); 
            link.title = url; // Show the full URL on hover
            link.target = "_blank"; // Open in a new tab

            /* Add click event to remove the link after it is followed */
            link.addEventListener("click", async (event) => {
                // Prevent the default link behavior temporarily
                event.preventDefault();

                // Open the link after removing the tab
                window.open(url, "_blank");

                // Remove the tab from storage first
                setTimeout(async () => {
                    await removeTabFromList(index); 
                }, 500);

                // Refresh the list
                displayClosedTabs(); 
            });

            list_item.appendChild(link);
            list_element.appendChild(list_item);
        });
    } catch (error) {
        console.error("Error displaying closed tabs:", error);
    }
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
