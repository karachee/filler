String.prototype.capitalizeFirstLetter = function() {
    return this.join().charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.splitCamelCase = function() {
    return this.join().split(/(?=[A-Z])/).join(" ");
};

String.prototype.join = function() {
    return this.split(" ").join("");
};


function addClickEventListenersById(id, clickHandler){
    let item = document.getElementById(id);
    if (item) {
        item.removeEventListener("click", clickHandler);
        item.addEventListener("click", clickHandler);
    }
}

function addClickEventListenersByClassName(className, clickHandler){
    let items = document.getElementsByClassName(className);
    if (items) {
        for (let itemIndex in items) {
            if (items.hasOwnProperty(itemIndex)) {
                let item = items[itemIndex];
                if (item.addEventListener) {
                    item.removeEventListener("click", clickHandler);
                    item.addEventListener("click", clickHandler);
                }
            }
        }
    }
}

function addDoubleClickEventListenersByClassName(className, clickHandler){
    let items = document.getElementsByClassName(className);
    if (items) {
        for (let itemIndex in items) {
            if (items.hasOwnProperty(itemIndex)) {
                let item = items[itemIndex];
                if (item.addEventListener) {
                    item.removeEventListener("dblclick", clickHandler);
                    item.addEventListener("dblclick", clickHandler);
                }
            }
        }
    }
}

function addFocusAndSelectById(id){
    let element = document.getElementById(id);
    if (element) {
        element.focus();
        element.select();
    }
}

/**
 * Use:
 * async function something(){
 *      for(const x in something){
 *          await wait(1000);
 *          //...do something
 *      }
 * }
 * @param waitTime
 * @returns {Promise<any>}
 */
function wait(waitTime){
    return new Promise(resolve => setTimeout(resolve, waitTime));
}