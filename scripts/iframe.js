var current_action = "";
var contentFields = [
    "page_link",
    //"title",
    "author",
    "content",
    "link",
];

// add listeners for event/textarea
var inputElements = document.getElementsByTagName("input");
for (var i = 0, len = inputElements.length; i < len; i++) {
    var inputElement = inputElements[i];
    inputElement.onchange = function(e) {
        sentUpdatedDataToServer();
    };
}
var textareaElements = document.getElementsByTagName("textarea");
for (i = 0, len = textareaElements.length; i < len; i++) {
    var textareaElement = textareaElements[i];
    textareaElement.onchange = function(e) {
        sentUpdatedDataToServer();
    };
}


// handle set title binding
/*
var setTitleElement = document.getElementById("settitle");
setTitleElement.addEventListener(
    "click",
    function(e) {
        setAction("title");
    },
    false
);
*/
// handle set author binding
var setAuthorElement = document.getElementById("setauthor");
setAuthorElement.addEventListener(
    "click",
    function(e) {
        setAction("author");
    },
    false
);
// handle set link binding
var setLinkElement = document.getElementById("setlink");
setLinkElement.addEventListener(
    "click",
    function(e) {
        setAction("link");
    },
    false
);
// handling set content binding
var setContentElement = document.getElementById("setcontent");
setContentElement.addEventListener(
    "click",
    function(e) {
        setAction("content");
    },
    false
);

var sendToServerElement = document.getElementById("sendserver");
sendToServerElement.addEventListener(
    "click",
    function(e) {
        // now send this to the background
        console.log("Now sending to the background.....");
        sentUpdatedDataToServer();
        chrome.runtime.sendMessage({Message: "iframe-send-server"}, function (response) {
            ;
        })
    },
    false
);

var clearContentsElement = document.getElementById("clearcontent");
clearContentsElement.addEventListener(
    "click",
    function(e) {
        // now send this to the background
        console.log("Now sending to the background.....");
        chrome.runtime.sendMessage({Message: "iframe-clear-content"}, function (response) {
            ;
        })
    },
    false
);

function sentUpdatedDataToServer() {
    // gather content
    var serverData = {};
    for (var contentFieldsI = 0; contentFieldsI < contentFields.length; contentFieldsI++) {
        var attribute = contentFields[contentFieldsI];
        serverData[attribute] = document.getElementById(attribute).value;
    }
    serverData["tags"] = document.getElementById("tags").value;
    console.log(serverData);

    chrome.runtime.sendMessage({Message: "iframe-update-content", ServerContent: serverData}, function (response) {
        ;
    })
}

function updateFrontEndForms(content) {
    for (var contentFieldsI = 0; contentFieldsI < contentFields.length; contentFieldsI++) {
        var attribute = contentFields[contentFieldsI];
        var element = document.getElementById(attribute);
        if (element !== undefined) {
            element.value = content[attribute];
        }
    }
}

function clearFrontEndForms(content) {
    for (var contentFieldsI = 0; contentFieldsI < contentFields.length; contentFieldsI++) {
        var attribute = contentFields[contentFieldsI];
        var element = document.getElementById(attribute);
        if (element !== undefined) {
            element.value = "";
        }
    }
}

function setAction(action) {
    // Set the current action
    console.log("Setting capture action to: " + action);
    current_action = action;

    var element = document.getElementById("current_action");
    element.innerHTML = action;

    //
    ensureAlertGreen();
    var element = document.getElementById("active");
    element.innerHTML = "";

    // now send this to the background
    console.log("Now sending to the background.....");
    chrome.runtime.sendMessage({Message: "update-iframe-chosen-action", Action: action}, function (response) {
        ;
    })
}

function ensureAlertGreen() {
    var alert = document.getElementById("alert");
    alert.classList.remove("alert-danger");
    alert.classList.add("alert-primary");

    var element = document.getElementById("active");
    element.innerHTML = "";
}

function ensureAlertRed() {
    var alert = document.getElementById("alert");
    alert.classList.remove("alert-primary");
    alert.classList.add("alert-danger");

    var element = document.getElementById("active");
    element.innerHTML = "Select an attribute to start listening!<br/>";
}

function updateLatestSelection(latestSelection) {
    return; //turned off currently
    var element = document.getElementById("last_selection");
    element.innerHTML = latestSelection;
}

chrome.runtime.onMessage.addListener (function (request, sender, sendResponse) {
    console.log("iframejs: From background.js: ");
    console.log(request);

    if (request.Message == 'background-content-update') {
        var content = request.Content;
        var latestSelection = request.Latest;
        console.log(content);

        updateFrontEndForms(content);
        updateLatestSelection(latestSelection);
    }

    else if (request.Message == 'background-sent-to-server') {
        var responseText = request.ResponseText;
        console.log(responseText);
        if (responseText !== undefined) {
            responseText = JSON.parse(responseText);
            alert(responseText.message);
        }
        // now, reset
        current_action = ""; // reset the current action
        ensureAlertRed();
        clearFrontEndForms();

    }
});


