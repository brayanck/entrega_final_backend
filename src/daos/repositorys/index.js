const User = require('../mongodb/classes/user.dao')
const Cart = require('../mongodb/classes/cart.dao')
const Product = require('../mongodb/classes/product.dao')
const Ticket = require('../mongodb/classes/ticket.dao')
const Message = require('../mongodb/classes/message.dao')
const MessageRepository = require('../repositorys/Message.repository')
const TicketRepository = require('../repositorys/Ticket.repository')
const UserRepository = require('./Users.repository')
const CartRepository = require('./Cart.repository')
const ProductRepository= require('./Product.repository')
const userServices = new UserRepository(new User())
const cartServices = new CartRepository(new Cart())
const productServices = new ProductRepository(new Product())
const ticketServices = new TicketRepository(new Ticket())
const messageServices = new MessageRepository(new Message())

module.exports={
    userServices,
    cartServices,
    productServices,
    ticketServices,
    messageServices
}