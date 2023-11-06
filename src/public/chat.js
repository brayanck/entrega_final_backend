const socket = io();
const messageForm = document.getElementById("menssage-form")
const chat = document.getElementById("chat")
const message = document.getElementById("menssage")


messageForm.addEventListener("submit", async(e) => {
    e.preventDefault()
    try {
        const response = await fetch(`/api/users/user`);
        const data = await response.json();
        let mensaje= {
            email:data.email,
            message: message.value
        }
        socket.emit("send-message",mensaje)
        message.value=""
        // Aquí puedes realizar acciones adicionales después de agregar el producto al carrito
    } catch (error) {
        console.log('Error al agregar un mensaje');
    }


    })
    socket.on("new-message", (data) => {
        chat.innerHTML+=`<b>${data.email}</b>: <p>${data.message}</p>`
    }) 
    
    socket.on("load-old-messages",(data)=>{
        data.map((el)=>{
            render(el)
        })
    })
    
    const render = (data)=>{
        chat.innerHTML+=`<p>${data.email}: ${data.message}</p>`
    }