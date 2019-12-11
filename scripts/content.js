console.log("content.js");

var current_action = "";

chrome.runtime.onMessage.addListener (function (request, sender, sendResponse) {
    console.log("contentjs: From background.js: ");
    console.log(request);

    if (request.Message == "update-iframe-action-received") {
        current_action = request.Action;

        console.log("contentjs: saving current action as " + current_action);
    }

    return true; // <-- Indicate that sendResponse will be async
});

// send the page url
chrome.runtime.sendMessage({Message: "content-send-url", Selection: window.location.href}, function (response) {
    ;
})

/**
 * Watch a
 * @type {NodeList}
 */
/*
var aElements = document.getElementsByTagName("a");
for (var i = 0, len = aElements.length; i < len; i++) {
    var aElement = aElements[i];
    aElement.onclick = function(e) {
        console.log("a click");
        console.log(e);
        if (current_action == "link") {
            console.log("dont't follow the link but get the href");
            // prevent following
            e.preventDefault();
            var linkElement = e.srcElement;
            var link = getHrefFromNode(linkElement);

            if(selectedText.length) {
                chrome.runtime.sendMessage({Message: "content-update-selection", Selection: link}, function (response) {
                    ;
                })
            }
        } else {
            // act normally
        }
    };
}
*/

window.addEventListener("mouseup", function(evt) {
    console.log("contentjs: mouseup");

    if (current_action.length > 0) {
        if (current_action == "title" || current_action == "author") {
            // get the selected text
            var selectedText = getSelectedText();
        } else if (current_action == "content") {
            var selectedText = getHTMLOfSelection();
        } else if (current_action == "link") {
            // get link from highlight
            var selectedText = getLinkFromSelection();
        } else {
            var selectedText = "";
        }

        if(selectedText.length) {
            chrome.runtime.sendMessage({Message: "content-update-selection", Selection: selectedText}, function (response) {
                ;
            })
        }
    }
});

function getSelectedText() {
    var txt = "";
    if (window.getSelection) {
        txt = window.getSelection().toString();
    } else if (document.getSelection) {
        txt = document.getSelection();
    } else if (document.selection) {
        txt = document.selection.createRange().text;
    }
    return txt;
}

function getHTMLOfSelection() {
    var range;
    if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        return range.htmlText;
    } else if (window.getSelection) {
        var selection = window.getSelection();
        if (selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
            var clonedSelection = range.cloneContents();
            var div = document.createElement("div");
            div.appendChild(clonedSelection);
            return div.innerHTML;
        }
    }

    return "";
}

/**
 * Function to return a link embedded in the HTML of the highlighted text
 * @returns {*}
 * @deprecated Now using an event listener on a tag clicks, see
 */
function getLinkFromSelection() {
    console.log("getLinkFromSelection");
    var link = "";
    if (window.getSelection) {
        var selection = window.getSelection();
        if (selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
            var clonedSelection = range.cloneContents();
            var parentNode = selection.anchorNode.parentElement;
            link = getHrefFromNode(parentNode);
        }
    }

    return link;
}

/**
 *
 *
 * @param parentNode
 * @returns {*}
 */
function getHrefFromNode(parentNode) {
    maxLevels = 5;
    var hasATags = false;
    var count = 0; // endess loop bad, k?
    while (count < maxLevels && !hasATags) {
        var div = document.createElement("div");
        var clonedParentNode = parentNode.cloneNode(true);
        console.log(clonedParentNode);
        div.appendChild(clonedParentNode);
        var aElements = div.querySelectorAll("a");
        if (aElements.length > 0) {
            hasATags = true;
            var aElement = aElements[0];
            var href = aElement.getAttribute("href");
            div.removeChild(clonedParentNode);
            return href;
        } else {
            console.log("No a tags found at count " + count + ". So moving up a parent...");
            div.removeChild(clonedParentNode);
            hasATags = false;
            parentNode = parentNode.parentElement; // now move on up
        }
        count++;
    }

    return "";
}