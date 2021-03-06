const CONTEXT_MENU_TEXT_FILL_KEY = 'fillerTextFillContext';
const CONTEXT_MENU_UTILS = 'fillerUtilsContext';

function setContexts(contexts){
    return new Promise((resolve) => {
        chrome.storage.local.set({'contexts': contexts}, () =>{
            resolve('Done');

        });
    });
}

function getContexts(){
    return new Promise((resolve) => {
        chrome.storage.local.get(['contexts'], (result)=>{
            resolve((result) ? result.contexts : null);
        });
    });
}

function createContextMenu(context){
    if(context){
        let contextDef = {id: context.id, title: context.title, contexts: context.contextTypes};

        if(context.parentId){
            contextDef['parentId'] = context.parentId;
        }

        if(context.enabled!==null){
            contextDef['enabled'] = context.enabled;
        }

        chrome.contextMenus.create(contextDef);

        if(context.children){
            Object.entries(context.children).forEach(([key, value]) => {
                value.contextTypes = (!value.contextTypes) ? context.contextTypes : value.contextTypes;
                value.parentId = context.id;
                createContextMenu(value);
            });
        }
    }
}

function buildBaseContextMenus(contexts){
    if(contexts){
        contexts.forEach(context => createContextMenu(context));
    }
}

async function handleModelContextMenus(){
    let model = await getModel();
    if(model) {
        for(const key in model){
            await addChildrenToContextMenu(CONTEXT_MENU_TEXT_FILL_KEY, CONTEXT_MENU_TEXT_FILL_KEY +'-'+ key, key, key);
        }
    }
}

async function addChildrenToContextMenu(parentId, childId, title, variable){
    if(parentId){
        let contexts = await getContexts();
        let contextMenu = (contexts) ? contexts.find(x => x.id === parentId) : null;
        if(contextMenu) {
            let contextTypes = (contextMenu && contextMenu.contextTypes) ? contextMenu.contextTypes : ["all"];
            let contextChildren = (contextMenu.hasOwnProperty('children')) ? contextMenu.children : [];
            let child = {"id": childId, "parentId": parentId, "title": title, "contexts": contextTypes};
            contextChildren.push(child);
            contextMenu['children'] = contextChildren;

            chrome.contextMenus.create(child);

            if(contextMenu.action){
                child['action'] = contextMenu.action;
            }

            if(variable){
                child['variable'] = variable;
            }

            await setContexts(contexts);
        }
    }
}
async function resetContextMenus() {
    let contexts = await getContexts();
    if (!contexts) {
        contexts = [
            {
                'id': CONTEXT_MENU_TEXT_FILL_KEY,
                'title': 'Fill',
                'type': 'normal',
                "contextTypes": ["editable"],
                "enabled": true,
                "action": "fill"
            },
            {
                'id': CONTEXT_MENU_UTILS,
                'title': 'Utils',
                'type': 'normal',
                "contextTypes": ["editable"],
                "enabled": true,
                "action": "fill"
            }
        ];
        await setContexts(contexts);
    }

    chrome.contextMenus.removeAll(async () => {
        let found = contexts.find(x => x.id = CONTEXT_MENU_TEXT_FILL_KEY);
        if (found && found.children) {
            delete found.children;
            await setContexts(contexts);
        }

        buildBaseContextMenus(contexts);
        handleModelContextMenus();
    });
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    let model = await getModel();
    let contexts = await getContexts();
    if(info && tab && contexts && model){
        if(info.menuItemId){
            let menuItemIdArr = info.menuItemId.split('-');
            let parentKey = (menuItemIdArr.length === 2) ?  menuItemIdArr[0] : null;
            if(parentKey){
                let menuItemContext = contexts.find(x => x.id === parentKey);
                let childMenuItemContext = (menuItemContext && menuItemContext.children) ? menuItemContext.children.find(x => x.id === info.menuItemId) : null;
                if(childMenuItemContext && childMenuItemContext.variable) {
                    let variable = model[childMenuItemContext.variable];
                    chrome.tabs.sendMessage(tab.id, {messageName: 'fillerContextHandler', variable});
                }
            }
        }
    }
});

chrome.runtime.onInstalled.addListener(() =>resetContextMenus());