# Filler Web Extension

Web extension that loads a key-value model to a context menu allowing an end user the ability to quickly fill 
input fields without having to change contexts and copy/paste each time. 

Ideally there would be an automated process to load the models bases on a the end user current task.

API Example:

```javascript
<html>
    <body>
        <h3>Create your model using JSON. Once finished hit the send button</h3>
        <textarea id="model" rows="25" cols="50">
        {
            "testKey":"testValue"
        }
        </textarea>
        <button id="send-button">Send</button>
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
                console.log(message.detail);
            }
        }, false);
    </script>
</html>
```