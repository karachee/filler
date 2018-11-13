let model = {
    'Patient First Name': 'Chris',
    'Patient Last Name': 'Loucks'
};

function setModel(incomingModel){
    model = incomingModel;
    resetContextMenus();
}

chrome.tabs.onRemoved.addListener((tabId, removeInfo) =>{
    if(apiPorts && tabId && apiPorts[tabId]!=null){
        delete apiPorts[tabId];
    }
});

chrome.browserAction.onClicked.addListener(tab => {

    chrome.tabs.query({url: 'chrome-extension://*/fillerConfig/fillerConfig.html'}, (tabs)=> {
        if(tabs && tabs.length!=0){
            chrome.windows.update(tabs[0].windowId,  {"focused": true});
        }else{
            chrome.windows.create({
                url: chrome.runtime.getURL("../fillerConfig/fillerConfig.html"),
                type: "popup",
                width: 750
            }, win => {
                let tabId = (win && win.tabs && win.tabs.length) ? win.tabs[0].id : null;
                if (tabId) {
                    chrome.tabs.sendMessage(tabId, {'messageName': 'showFillerConfig', model});
                }
            });
        }
    });
});