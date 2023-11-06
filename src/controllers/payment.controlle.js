const {SECRET_STRIP,SERVER_URL}=require('../config/config')
const stripe = require('stripe')(SECRET_STRIP)
const {
    cartServices, userServices,productServices
  } = require("../daos/repositorys/index");
const createSession = async(req,res)=>{
    
    try{
        let carrito = req.params.cid;
        let carro = await cartServices.getCartById(carrito);
        let user =await userServices.getUserbycarrito(carrito)
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode:'payment',
            line_items: carro.cart.map(item => {
                let unit =(item.product.price*100)/1000
                return {
                  price_data: {
                    currency: "usd",
                    product_data: {
                      name: item.product.name,
                      description:item.product.category
                    },
                    unit_amount: unit,
                  },
                  quantity: item.count,
                }
              }),
            success_url:`${SERVER_URL}/api/carts/${carrito}/purchase`,
            cancel_url:`${SERVER_URL}/api/carts/${carrito}`,

        })
        res.json({url: session.url})
    }catch(err){
        res.status(500).json({message: err.message})
    }
}





module.exports={
    createSession
}