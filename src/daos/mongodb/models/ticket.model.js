const mongoose = require('mongoose')
const uuid4= require('uuid4')
const ticketSchema = new mongoose.Schema({
    code:{
        type:String,
        default:uuid4()
    },
    amount:{
        type:Number,
        required:true
    },
    purcharser:{
        type:String,
        required:true
    }

},
{
    timestamps: true,
})


const Ticket = mongoose.model('Tiket', ticketSchema);

module.exports = Ticket;