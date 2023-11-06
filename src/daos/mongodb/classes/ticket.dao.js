const TicketModel = require('../models/ticket.model')

class Ticket{
    saveTiket = async (Data) => {
        try {
            return await TicketModel.create(Data);
        } catch (err) {
            return null;
        }
    };
}
module.exports=Ticket