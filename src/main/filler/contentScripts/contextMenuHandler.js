let selectedElement = null;

function contextHandler(variable) {
    selectedElement.value = (selectedElement && variable) ? variable : null;
}

function handleRightClickEvent(event) {
    selectedElement = (event != null && 2 === event.button) ? event.target : null;
}

function getAllElementsAndAddRightClickHandler() {
    let allElements = document.getElementsByTagName('*');
    if (allElements !== null && allElements.length > 0) {
        [...allElements].forEach(element => {
            if (element) {
                if (typeof element.addEventListener === 'function') {
                    element.removeEventListener("mousedown", handleRightClickEvent, true);
                    element.addEventListener("mousedown", handleRightClickEvent, true);
                }
            }
        });
    }
}

window.removeEventListener('load', getAllElementsAndAddRightClickHandler, false);
window.addEventListener('load', getAllElementsAndAddRightClickHandler, false);

chrome.runtime.onMessage.addListener((message) => {
    if (message && 'fillerContextHandler' === message.messageName) {
        contextHandler(message.variable);
    }
});