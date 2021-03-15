const mongoose = require('mongoose')

const verificationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    token: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
        expires: 1800
    }
})

const Verification = mongoose.model('verification', verificationSchema);

module.exports = Verification;