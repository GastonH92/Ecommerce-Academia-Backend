const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: String,
    imageUrl: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;