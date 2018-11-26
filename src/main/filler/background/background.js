async function setModelAndResetContextMenus(model){
    await setModel(model);
    await resetContextMenus();
}

function setModel(model){
    return new Promise((resolve) =>{
        chrome.storage.local.set({'model': model}, ()=>{
            resolve('Done');
        });
    });
}

function getModel(){
    return new Promise((resolve) => {
        chrome.storage.local.get(['model'], (result)=>{
            resolve((result) ? result.model : null);
        });
    });
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
            }, async (win) => {
                let tabId = (win && win.tabs && win.tabs.length) ? win.tabs[0].id : null;
                let model = await getModel();
                if (tabId) {
                    chrome.tabs.sendMessage(tabId, {'messageName': 'showFillerConfig', model});
                }
            });
        }
    });
});