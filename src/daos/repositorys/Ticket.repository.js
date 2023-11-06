class TicketRepository {
    constructor(dao){
        this.dao = dao;
    }
    saveTiket = async (Data) => {
        try {
            return await this.dao.saveTiket(Data);
        } catch (err) {
             ;
            return null;
        }
    };
}
module.exports = TicketRepository;