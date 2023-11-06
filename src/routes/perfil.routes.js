const router = require('express').Router()
const {isAuthenticated} = require('../utils/auth')
const {renderPerfil}=require('../controllers/perfil.controller')
router.use(isAuthenticated)


router.get('/',renderPerfil);


module.exports =  router