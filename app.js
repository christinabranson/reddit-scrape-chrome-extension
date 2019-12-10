window.addEventListener("mouseup", function(evt) {
    //alert("mouseup");
    var targ = evt.target;

    // Set the page URL if not set
    if (content["page_link"].length == 0) {
        content["page_link"] = window.location.href;
        updateFrontEndDisplay("page_link");
    }

    if (current_action.length > 0) {
        if (current_action == "title" || current_action == "author") {
            // get the selected text
            var selectedText = getSelectedText();
            content[current_action] = selectedText;
        } else if (current_action == "content") {
            var selectedText = getHTMLOfSelection();
            content[current_action] = selectedText;
        } else if (current_action == "link") {
            // get link from highlight
            var selectedText = getLinkFromSelection();
            content[current_action] = selectedText;
        }

        updateFrontEndDisplay(current_action);
    }
});

var content = {};
content["page_link"] = "";
content["title"] = "";
content["content"] = "";
content["content"] = "";
content["link"] = "";

var setTitleElement = document.getElementById("settitle");
console.log(setTitleElement);
setTitleElement.addEventListener("click",function(e){
    setAction("title");
},false);

var current_action = "link";
var selected_text = "";

function updateFrontEndDisplay(variable) {
    console.log("updateFrontEndDisplay: " + variable);
    if (content[variable] === undefined) {
        return;
    }

    var element = document.getElementById(variable);
    if (element !== undefined) {
        element.value = content[variable];
    }
}

function setAction(action) {
    // Set the current action
    console.log("Setting capture action to: " + action);
    current_action = action;

    var element = document.getElementById("current_action");
    element.innerHTML = action;
}

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

function getLinkFromSelection() {
    console.log("getLinkFromSelection");
    var range;
    if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        return range.htmlText;
    } else if (window.getSelection) {
        var selection = window.getSelection();
        if (selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
            var clonedSelection = range.cloneContents();
            var parentNode = selection.anchorNode.parentElement;
            var clonedParentNode = parentNode.cloneNode(true);
            console.log(parentNode);
            console.log(clonedParentNode);
            var div = document.createElement("div");
            div.appendChild(clonedParentNode);
            var aElements = div.querySelectorAll("a");
            if (aElements.length > 0) {
                var aElement = aElements[0];
                var href = aElement.getAttribute("href");
                div.removeChild(clonedParentNode);
                return href;
            }
        }
    }

    return "";
}
