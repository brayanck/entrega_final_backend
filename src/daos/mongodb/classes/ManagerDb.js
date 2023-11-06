const mongoose = require('mongoose')

class ManagerDb{
    constructor(path){
        this.path=path
    }
    conectarse = async () => {
        try {
            await mongoose.connect(this.path, {
                useUnifiedTopology: true,
                useNewUrlParser: true,
            })
            console.log("conecxion exitosa")
        } catch (err) {
             console.log(err)
        }
        
    }
}


module.exports = ManagerDb;