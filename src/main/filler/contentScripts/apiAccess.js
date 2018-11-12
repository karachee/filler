let port = chrome.runtime.connect(chrome.runtime.id, {name: "fillerApiAccess"});

window.addEventListener("message", function(event) {
    if (event && event.data && 'apiMessage' === event.data.type && event.data.message) {
        port.postMessage(event.data.message);
    }
}, false);

if(!!port) {
    port.onDisconnect.addListener(function() {
        port = null;
    });

    port.onMessage.addListener(function (message) {
        if(message !== null) {
            let payload = (typeof cloneInto !== 'undefined') ? cloneInto(message,document.defaultView) : message;
            let event = document.createEvent('CustomEvent');
            event.initCustomEvent("fillerExtensionMessage", true, false, payload);
            document.documentElement.dispatchEvent(event);
        }
    });
}