const mongoose = require('mongoose')

const MessagesSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
        },
    // email: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "email",
    //     required: true,
    // }
    email:{
        type: String,
        required: true
    }

})
// MessagesSchema.pre('find', function(next) {
//     this.populate('user');
//     next();
// });

const Message = mongoose.model("Message",MessagesSchema)
module.exports = Message
