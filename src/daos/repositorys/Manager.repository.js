
class ManagerRepository{
    constructor(dao){
        this.dao = dao;
    }
    conectarse = async () => {
        try {
            await this.dao.conectarse
            console.log("conecxion exitosa")
        } catch (err) {
             console.log(err)
        }
        
    }
}
module.exports=ManagerRepository