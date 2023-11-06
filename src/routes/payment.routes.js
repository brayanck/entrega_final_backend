
const router = require('express').Router()

const {createSession} =require('../controllers/payment.controlle')
router.post("/:cid",createSession)


module.exports = router