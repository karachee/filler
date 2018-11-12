let apiPorts = {};

function hanldeMessage(message, sender, sendResponse, apiMessage){
    if(message!=null && message.messageName!=null){
        switch (message.messageName) {
            case "setModel":
                setModel(message.model);
                break;
            default:
        }

        if(apiMessage){
            broadcastMessageToConnectedApiPorts({messageName: message.messageName+'Ack'});
        }
    }
}

function broadcastMessageToConnectedApiPorts(message){
    if(apiPorts && message){
        Object.values(apiPorts).forEach(port =>{
            try{
                port.postMessage(message);
            }catch(err){
                if(err.message === "Attempting to use a disconnected port object") {
                }
            }
        });
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>(hanldeMessage(message, sender, sendResponse)));

chrome.runtime.onConnect.addListener(function(port) {
    if (port && 'fillerApiAccess' === port.name && port.sender && port.sender.tab && apiPorts) {
        if(apiPorts[port.sender.tab.id]!=null){
            delete apiPorts[port.sender.tab.id];
        }
        apiPorts[port.sender.tab.id] = port;
        port.onMessage.addListener((message, sender, sendResponse) => hanldeMessage(message, sender, sendResponse, true));
    }
});