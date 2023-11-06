const dotenv = require('dotenv');

const {Command} =require('commander');
const program = new Command()

program
.option('-d', 'variable para debug',false)
.option('-p <port>', 'Puerto del servidor',8080)
.option('--mode <mode>', 'Modo de trabajo','develop')
program.parse()

const environment = program.opts().mode
dotenv.config({
    path:environment==="production"?"./src/config/.env.production":"./src/config/.env.development"
});
module.exports = {
    PORT: process.env.PORT,
    CLIENTID: process.env.CLIENTID,
    CLIENTSECRET: process.env.CLIENTSECRET,
    MONGO_URL: process.env.MONGO_URL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    MAIL_ID:process.env.MAIL_ID,
    MP: process.env.MP,
    SECRET_STRIP:process.env.SECRET_STRIP,
    PUBLIC_STRIP:process.env.PUBLIC_STRIP,
    SERVER_URL:process.env.SERVER_URL,
    environment:environment
    
};