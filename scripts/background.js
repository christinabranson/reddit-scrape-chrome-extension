console.log("At least reached background.js")

chrome.extension.onConnect.addListener(function(port) {
    console.log("Connected .....");
    port.onMessage.addListener(function(msg) {
        console.log("message recieved " + msg);
        port.postMessage("Hi Popup.js");
    });
});


chrome.runtime.onMessage.addListener (
    function (request, sender, sendResponse) {
        console.log(request);
        if (request.Message == 'update-iframe-chosen-action') {
            console.log("Updating chosen action!");
            console.log("New action: " + request.Action);

            // Now send back to the iframe
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {Message: 'update-iframe-action-recieved'}, function(response) {
                    ;
                });
            });

            return true; // <-- Indicate that sendResponse will be async
        }

        if (request.Message == "update-popup-selection") {
            console.log("Updates selection!");
            console.log("New selection: " + request.Selection);

            // Now send back to the iframe
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {Message: 'update-popup-selection-recieved'}, function(response) {
                    ;
                });
            });

            return true; // <-- Indicate that sendResponse will be async
        }

    }
);
