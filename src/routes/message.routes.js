const express = require('express')
const { Router } = express
const router = new Router()
const {isAuthenticated,isAuthenticatedUser} = require('../utils/auth')
router.use(isAuthenticated)
router.use(isAuthenticatedUser)
const {messageServices}=require("../daos/repositorys/index")


module.exports = function (io) {
    router.get('/', (req, res) => {
        res.render("chat", {})
    });
    io.on("connection", async (socket) => {
        const emitMessage = async () => {
            const messages =await messageServices.getAllMessages();
            const projectMessages = messages.map((msg) => {
                return {
                    email: msg.email,
                    message: msg.message
                };
            });
            io.emit("load-old-messages", projectMessages);
        }
        emitMessage()

        socket.on("send-message", async (data) => {

            let objeto = {
                email: data.email,
                message: data.message
            }
            let newMsg = await messageServices.createMessage(objeto);
            io.sockets.emit("new-message", {
                message: data.message,
                email: data.email
            });
        });

        socket.on('disconnect', (data) => {

        })

    });

    return router
};
