const UserDto = require('../dto/users.dto')
class UserRepository{
    constructor(dao){
        this.dao = dao;
    }
    getUserByEmail = async (email) => {
        try {
            return await this.dao.getUser(email);
        } catch (err) {
            return null;
        }
    };
    getAllUsers = async()=>{
        try {
            return await this.dao.getAllUsers();
        } catch (err) {
            return null;
        }
    }
    createUser = async (userData) => {
        try {
            const userDto = new UserDto(userData)
            return await this.dao.saveUser(userDto);
        } catch (err) {
            return null;
        }
    };
    getUserbycarrito = async (idCarrito) => {
        try {
            return this.dao.getUserbycarrito(idCarrito) 
        } catch (err) {
            return null;
        }
    };
    updateUser = async (userId, updatedUserData) => {
        try {
            const updatedUser = await this.dao.updateUser(userId, updatedUserData);
            return updatedUser;
        } catch (err) {
            return null;
        }
    };
    getUserByToken = async (token) => {
        try {
            return await this.dao.getUserByToken(token);
        } catch (err) {
            return null;
        }
    };
    pushdocuments = async (idUser, agregar) => {
        try {
            return await this.dao.pushdocuments(idUser,agregar)
        } catch (err) {
            return null;
        }
    };
    deleteUser = async (email) => {
        try {
            return await this.dao.deleteUser(email);
        } catch (err) {
            return null;
        }
    };

}
module.exports=UserRepository