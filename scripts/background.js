console.log("At least reached background.js");

var chosen_action = "";

var contentFields = [
    "page_link",
    //"title",
    "author",
    "content",
    "link",
];

var content = {};
clearContentFields();

function clearContentFields() {
    for (var contentFieldsI = 0; contentFieldsI < contentFields.length; contentFieldsI++) {
        var attribute = contentFields[contentFieldsI];
        content[attribute] = "";
    }
}

chrome.runtime.onMessage.addListener (
    function (request, sender, sendResponse) {
        console.log(request);

        if (request.Message == 'content-send-url') {
            content["page_link"] = request.Selection;

            console.log(content);

            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {Message: 'background-content-update', Content: content}, function(response) {
                    ;
                });
            });

            return true; // <-- Indicate that sendResponse will be async
        }

        else if (request.Message == 'update-iframe-chosen-action') {
            console.log("Updating chosen action!");
            console.log("New action: " + request.Action);

            chosen_action = request.Action;

            // Now send back to the iframe
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {Message: 'update-iframe-action-received', Action: chosen_action}, function(response) {
                    ;
                });
            });

            return true; // <-- Indicate that sendResponse will be async
        }

        else if (request.Message == "content-update-selection") {
            console.log("Updates selection!");
            console.log("New selection: " + request.Selection);

            content[chosen_action] = request.Selection;

            console.log(content);

            // Now send back to the iframe
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {Message: 'background-content-update', Content: content, Latest: request.Selection}, function(response) {
                    ;
                });
            });

            return true; // <-- Indicate that sendResponse will be async
        }

        else if (request.Message == "iframe-send-server") {
            clearContentFields();

            console.log(content);

            // Now send back to the iframe
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {Message: 'background-content-update', Content: content}, function(response) {
                    ;
                });
            });

            return true; // <-- Indicate that sendResponse will be async
        }

        else if (request.Message == "iframe-clear-content") {
            clearContentFields();

            console.log(content);

            // Now send back to the iframe
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {Message: 'background-content-update', Content: content}, function(response) {
                    ;
                });
            });

            return true; // <-- Indicate that sendResponse will be async
        }


        return true; // <-- Indicate that sendResponse will be async

    }
);
