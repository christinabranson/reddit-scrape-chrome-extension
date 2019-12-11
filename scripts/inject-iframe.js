// Inject the iframe into the page
let src		= chrome.extension.getURL('html/iframe.html?time='+(new Date().getTime()));

let iframe = document.getElementById('ssac-iframe-saver-box');
if (iframe == null) {
    console.log("Creating iframe...");
    console.log(src);
    let iframeContainer = document.createElement('div');
    iframeContainer.id = 'ssac-iframe-saver-box';

    let iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.id = 'ssac-iframe-saver-box-iframe';

    iframeContainer.append(iframe);

    window.onload = () => {
        document.body.appendChild(iframeContainer);
    };
} else {
    console.log("iframe exists");
}
