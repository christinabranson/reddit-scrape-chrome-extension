console.log("At least reached background.js");

// find a better place to put these....
var api_username = "api_user";
var api_password= "cPsSEfwfsHBJErv4AM8qhwptBmePkd78pQsKdGNXNWE5qyznHuUhxNEzaZM9VmxGASynkU3dXy8f";

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
            console.log("Now sending shit to the server....");

            var dataForServer = {
                auth: {
                    user: api_username,
                    password: api_password
                },
                data: content
            };

            // send the data
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function() {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    alert(xhr.responseText);
                }
            }

            var url = "http://localhost/api/postStory";
            var dataJSON = JSON.stringify(dataForServer);
            console.log(dataJSON);

            xhr.open('POST', url);
            xhr.send(dataJSON);

            xhr.onload = function (data) {
                console.log("xhr");
                console.log(data);
            };

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
