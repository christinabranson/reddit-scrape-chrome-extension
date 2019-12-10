console.log("At least reached background.js")
chrome.runtime.onMessage.addListener (
    function (request, sender, sendResponse) {
        console.log(request);
        if (request.Message == 'update-iframe-chosen-action') {
            console.log("Updating chosen action!");
            console.log("New action: " + request.Action);

            // Now send back to the iframe
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {Message: 'update-action-recieved'}, function(response) {
                    ;
                });
            });

            return true; // <-- Indicate that sendResponse will be async
        }

    }
);
