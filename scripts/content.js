console.log("content.js");

var port = chrome.extension.connect({
    name: "Content JS Connection"
});
port.postMessage("Hi BackGround");
port.onMessage.addListener(function(msg) {
    console.log("message recieved" + msg);
});

document.addEventListener('mouseup',function(event)  {
    console.log("content.js: mouseup");
    var sel = window.getSelection().toString();
    console.log(sel);

    if(sel.length) {
        chrome.runtime.sendMessage({Message: "update-popup-selection", Selection: sel}, function (response) {
            ;
        })
    }
})
