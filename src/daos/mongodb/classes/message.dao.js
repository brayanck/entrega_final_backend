const MessageModel = require("../models/messages.model");
class Message {
  getAllMessages = async () => {
    try {
      return await MessageModel.find({});
    } catch (err) {
       ;
      return null;
    }
  };
  createMessage = async (objeto) => {
    try {
        let newMsg = new MessageModel(objeto);
        await newMsg.save();
        return newMsg; // Devolver el objeto guardado
    } catch (err) {
        return null;
    }
};
}

module.exports = Message;
