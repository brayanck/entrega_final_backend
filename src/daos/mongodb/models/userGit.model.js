const mongoose = require('mongoose');

const userGitSchema = new mongoose.Schema(
    {
        fullname: { type: String },
        username: { type: String },
        githubId: { type: String, unique: true },
        location: { type: String },
        phone: { type: String },
        email: { type: String, lowercase: true },
        profilePhoto: { type: String, default: '' },
        password: { type: String },
        cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }
    },
    { timestamps: true }
);

const UserGit = mongoose.model('UserGit', userGitSchema);

module.exports = UserGit;