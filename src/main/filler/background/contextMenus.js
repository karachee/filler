let CONTEXT_MENU_TEXT_FILL_KEY = 'fillerTextFillContext';
let CONTEXT_MENU_UTILS = 'fillerUtilsContext';

let contexts = [
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

function handleModelContextMenus(){
    if(model) {
        Object.keys(model).forEach(function (key) {
            addChildrenToContextMenu(CONTEXT_MENU_TEXT_FILL_KEY, CONTEXT_MENU_TEXT_FILL_KEY +'-'+ key, key, key);
        });
    }
}

function addChildrenToContextMenu(parentId, childId, title, variable){
    if(parentId){
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
        }
    }
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

function buildBaseContextMenus(){
    if(contexts){
        contexts.forEach(context => {
            createContextMenu(context);
        });
    }
}

function resetContextMenus(){
    chrome.contextMenus.removeAll(function(){
        let found = contexts.find(x => x.id = CONTEXT_MENU_TEXT_FILL_KEY);
        if(found && found.children){
            delete found.children;
        }
        buildBaseContextMenus();
        handleModelContextMenus();
    });
}

function getVariableValue(variable){
    return (variable && model) ? model[variable] : null;
}

chrome.contextMenus.onClicked.addListener((info, tab) =>{
    if(info && tab && contexts){
        if(info.menuItemId){
            let menuItemIdArr = info.menuItemId.split('-');
            let parentKey = (menuItemIdArr.length === 2) ?  menuItemIdArr[0] : null;
            if(parentKey){
                let menuItemContext = contexts.find(x => x.id === parentKey);
                let childMenuItemContext = (menuItemContext && menuItemContext.children) ? menuItemContext.children.find(x => x.id === info.menuItemId) : null;
                if(childMenuItemContext && childMenuItemContext.variable) {
                    chrome.tabs.sendMessage(tab.id, {
                        messageName: 'fillerContextHandler',
                        variable: getVariableValue(childMenuItemContext.variable)
                    });
                }
            }
        }
    }
});

chrome.runtime.onInstalled.addListener(() => {
    resetContextMenus();
});