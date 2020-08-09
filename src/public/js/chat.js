let messages = [];
let user_id = '';
let grupo_id = '';
let socket = io();
async function deleteMessage(id){
    $.confirm({
        title:'Eliminar mensaje',
        content: '¿Esta seguro de eliminar el mensaje?',
        buttons:{
            confirm: async function(){
                try {
                    await fetch(`/messages/${id}`, {method:'DELETE'});
                    await globalThis.getMasseges(grupo_id)
                } catch (error) {
                   console.log(error)
                }
            },
            cancel:function(){
                return;
            }
        }
    })
}
async function getMasseges(id){
    try {
        let [response,res] = await Promise.all([
            fetch(`/messages?grupo=${id}`),
            fetch(`/grupos/${id}`)
        ]);
        let [messages, grupo] = await Promise.all([
            response.json(),
            res.json()
        ]);
        chat_container = document.getElementById('chat-container');
        chat_container.innerHTML = '';
        
        messages.forEach((element)=>{
            let child = document.createElement('div')
            let innerChild = document.createElement('div');
            innerChild.classList.add('message');
            let name = document.createElement('P');
            name.style.fontSize = '13px'
            
            name.style.marginBottom = '0px'
            name.style.padding = '0px';
            name.classList.add('col-md-3', 'col-6', 'col-sm-6')
            if(element.user_id == user_id){
                name.style.marginRight = '25px';
                name.style.textAlign = 'right';
                name.style.marginLeft = '100%';
                name.innerText = moment(element.fecha_at).startOf('minutes').fromNow();
                innerChild.classList.add('my-message');
                innerChild.style.cursor = 'pointer'
                innerChild.ondblclick = (event)=> deleteMessage(element.id);
                child.classList.add('row','justify-content-end')
                child.appendChild(name);
            }else{
                name.style.marginLeft = '25px'
                name.style.cursor = 'pointer';
                name.style.marginRight = '100%';
                name.innerText = element.username + ' - ' + moment(element.fecha_at).startOf('minutes').fromNow();
                name.onclick = (event)=> creatGroupEvent(element.user_id);
                child.classList.add('row','justify-content-start')
                innerChild.classList.add('other-message');
                child.appendChild(name);
            }
            innerChild.innerText = element.message;
            child.appendChild(innerChild);
            chat_container.appendChild(child);
        });
        let title = document.getElementById('sala-title')
        title.innerText = grupo.nombre;
        grupo_id = id;
        chat_container.scrollTop = chat_container.scrollHeight;
        setChatEvent();
    } catch (error) {
        console.log(error);
    }
}
async function sendMessage(message){
    try {
        await fetch(`/messages`, {
            method: 'POST',
            body: JSON.stringify({
                message:message,
                grupo_id:grupo_id
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        });
    } catch (error) {
        console.log(error);
    }
}

async function getGrupos(){
    let grupos = []
    try {
        let res = await fetch('/grupos')
        grupos = await res.json();
    } catch (error) {
        console.log(error);
        return;
    }
    let lista_grupos = document.getElementById('lista-grupos');
    lista_grupos.innerHTML = '';
    grupos.forEach(element =>{
        let li = document.createElement('LI');
        li.classList.add('list-group-item');
        li.onclick = (event)=> getMasseges(element.id);
        if(element.tipo == 1)
            li.innerText = element.nombre;
        else if(element.tipo==2)
            li.innerText = element.username;
        lista_grupos.appendChild(li);
    });
}

async function creatGroupEvent(reciver_id){
    try {
        let res = await fetch('/grupos',{
            method:'POST',
            body:JSON.stringify({
                user_2:reciver_id
            }),
            headers:{
                'Content-Type': 'application/json'
            }
        });
        let data = await res.json()
        if(data.insertId){
            await getGrupos();
            await getMasseges(data.insertId);
        }else if(data.id){
            await getMasseges(data.id);
        }
    } catch (error) {
        console.log(error);
    }
}



function search(strVal, reset = false){
    let objFind = document.getElementsByClassName('message');
    let exp1 = new RegExp('('+strVal+')', 'ig');
    let first = null;
    for (let i = 0; i < objFind.length; i++) {
        var coincValues = objFind[i].textContent.match(exp1);
        if(coincValues != null && reset != true){
            if(first == null) first = i;
            objFind[i].innerHTML = replacer(coincValues, objFind[i].innerHTML);
        }else if(reset == true){
            objFind[i].innerHTML = replacer(false, objFind[i].innerHTML);
        }else{
            objFind[i].innerHTML = replacer(false, objFind[i].innerHTML);
        }
    }
    if(first != null){
        let pos = objFind[first].offsetTop;
        document.getElementById('chat-container').scrollTop = pos;
    }else{
        document.getElementById('chat-container').scrollTop = document.getElementById('chat-container').scrollHeight;
    }
}

function replacer(coincValues, content){
    let returnValueFormat;
    content = content.replace(/(<span style="background: red;">)([\w\s]+)(<\/span>)/g, '$2');
    if (coincValues != false) {
        for (let j =0; j < coincValues.length; j++) {
            let exp2 = new RegExp('('+coincValues[j]+')(?!>)', 'gi');
            returnValueFormat = content.replace(exp2, '<span style="background: red;">$1</span>');
        }
    } else {
        returnValueFormat = content;
    }
    return returnValueFormat;
}

function setVariables(id){
    user_id = id
}

function setChatEvent(){
    socket.on(`new-message-${grupo_id}`, async()=>{
        await globalThis.getMasseges(grupo_id);
    })
}

window.onload = function(){
    document.getElementById('input-message').onkeydown = async function(event){
        if(event.code != 'Enter' || !grupo_id || this.value == "") return
        await sendMessage(event.target.value);
        event.target.value = '';
        await getMasseges(grupo_id);
    }
    document.getElementById('term-search').onkeyup = async function(event){
        if(this.value.length > 0){
            search(this.value)
        }else{
            search('', true);
        }
    }
    document.getElementById('button-message').onclick = async function (event){
        let val = document.getElementById('input-message').value;
        if(val == "" || !grupo_id) return
        await sendMessage(val);
        document.getElementById('input-message').value = '';
        await getMasseges(grupo_id);
    }
}
