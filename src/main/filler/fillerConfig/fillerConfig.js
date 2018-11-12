let model;
let editing = false;

function buildModelDefinition(){
    editing = false;

    if(model) {
        let fillerConfigModelDefinitionContainerElement = document.getElementById('filler-config-model-definition-container');
        if(fillerConfigModelDefinitionContainerElement){
            let html = "<div id='model-definition'>";
            Object.entries(model).forEach(entry => {
                html += "<div class='model-definition-item' data-key='"+entry[0]+"'>"+
                    "<div class='model-definition-item-key'>"+entry[0].splitCamelCase().capitalizeFirstLetter()+"</div>"+
                    "<div class='model-definition-item-value'>"+entry[1]+"</div>"+
                    "<div style='width:30%'></div>"+
                    "</div>";
            });
            html += '</div>';
            fillerConfigModelDefinitionContainerElement.innerHTML = html;

            addDoubleClickEventListenersByClassName('model-definition-item', editModelItem);
        }
    }
}

function editModelItem(event){
    if(!editing) {
        let element = (event && event.target) ? event.target : null;
        if (element && element.parentElement && model) {
            let key = element.parentElement.getAttribute("data-key");
            let value = (key) ? model[key] : null;

            if (key && value) {
                editing = true;

                element.parentElement.innerHTML = "<input class='model-definition-item-key model-definition-item-edit' value='"+ key.splitCamelCase().capitalizeFirstLetter() + "'</input>" +
                    "<input class='model-definition-item-value model-definition-item-edit' value='" + value + "'</input>" +
                    "<div class='model-definition-item-edit model-definition-item-edit-buttons'>" +
                    "<button id='model-definition-item-edit-delete' class='button button-error edit-button' style='margin-right: 5px;'>Delete</button>" +
                    "<button id='model-definition-item-edit-cancel' class='button button-warning edit-button' style='margin-right: 5px;'>Cancel</button>" +
                    "<button id='model-definition-item-edit-done' class='button button-success edit-button' style='margin-right: 5px;'>Done</button>" +
                    "</div>";

                addClickEventListenersById('model-definition-item-edit-delete', handleEditDeleteButton);
                addClickEventListenersById('model-definition-item-edit-cancel', buildModelDefinition);
                addClickEventListenersById('model-definition-item-edit-done', handleEditDoneButton);
            }
        }
    }
}

function handleEditDeleteButton(event){
    editing = false;

    let element = (event && event.target) ? event.target : null;
    let key = (element && element.parentElement && element.parentElement.parentElement) ? element.parentElement.parentElement.getAttribute("data-key") : null;
    if(key && model){
        delete model[key];
        buildModelDefinition();
    }
}

function handleEditDoneButton(event){
    editing = false;

    let element = (event && event.target) ? event.target : null;

    if(element && element.parentElement && element.parentElement.parentElement && element.parentElement.parentElement.children.length>=2){
        let key = element.parentElement.parentElement.getAttribute("data-key");
        let newKey = element.parentElement.parentElement.children[0].value;
        let newValue = element.parentElement.parentElement.children[1].value;
        if(key && newKey && newValue && model){
            delete model[key];
            model[newKey] = newValue;
            buildModelDefinition();
        }
    }
}

function handleImport(e) {
    let content = e.target['result'];
    if (content) {
        try {
            model = JSON.parse(content);
            buildModelDefinition();
        }catch(err){
            console.log(`Error parsing file, ${err}`)
        }
    }
}

document.addEventListener('DOMContentLoaded', ()=> {
    addClickEventListenersById('filler-config-cancel-button', ()=>{
        window.close();
    });

    addClickEventListenersById('filler-config-done-button', ()=>{
        window.close();
        chrome.runtime.sendMessage({'messageName': 'setModel', model});
    });

    addClickEventListenersById('filler-config-add-button', ()=>{
        if(model){
            model['New Key'] = 'New Value';
            buildModelDefinition();
            let element = [... document.querySelectorAll('.model-definition-item')].find(x => x.getAttribute("data-key") === 'New Key');
            if(element){
                element.firstChild.dispatchEvent(new MouseEvent('dblclick', {'view': window, 'bubbles': true, 'cancelable': true}))
            }
        }
    });

    document.getElementById('choose-file').addEventListener("change", (event)=>{
        if(event){
            let file = event.target.files[0];
            if (file) {
                let reader = new FileReader();
                reader.onload = this.handleImport.bind(this);
                reader.readAsText(file);
            }
        }
    });
});

chrome.runtime.onMessage.addListener(function(message) {
    if(message && 'showFillerConfig' === message.messageName){
        model = message.model;
        buildModelDefinition();
    }
});