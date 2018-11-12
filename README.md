# Filler Web Extension

Web extension that loads a key-value model to a context menu allowing an end user the ability to quickly fill 
input fields without having to change contexts and copy/paste each time. 

Ideally there would be an automated process to load the models bases on a the end user current task.


###API Example:

```javascript
<html>
    <body>
        <h3>Create your model using JSON. Once finished hit the send button</h3>
        <textarea id="model" rows="25" cols="50">
        {
            "testKey":"testValue"
        }
        </textarea>
        <button id="send-button" disabled>Send</button><span id="extension-info" style="margin-left:10px;color:red;">Extension not installed</span>
        <div>
            <h3>Test Here:</h3>
            <p>Right click in the input field, hover over 'Filer' in the context menu, then 'Fill'</p>
            <input style="width: 15%;">
        </div>
    </body>
    <script>
        document.getElementById("send-button").addEventListener("click",() =>{
            window.postMessage({type: 'apiMessage', message: {messageName:'setModel', model:JSON.parse(document.getElementById('model').value) }}, "*");
        }, false);

        document.addEventListener("fillerExtensionMessage", (message)=>{
            if (message && message.target && message.detail) {
                
                if('extensionInfo' === message.detail.messageName){
                    let element = document.getElementById('extension-info');
                    element.textContent = `Extension version ${message.detail.message.extensionVersion} installed`; 
                    element.style.color = 'green';

                    document.getElementById('send-button').removeAttribute('disabled');
                }
                
                console.log(message.detail);
            }
        }, false);

        (()=>{
            window.postMessage({type: 'apiMessage', message: {messageName:'extensionInfo'}}, "*");
        })();
    </script>
</html>
```