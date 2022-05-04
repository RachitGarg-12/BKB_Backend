const mongoose = require('mongoose');
const { Schema } = mongoose;

const ServiceSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    itemCode: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    imgLink: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true,
    },
    used:{
        type:String,
        required:true
    },
    price: {
        type: Number,
        required: true
    },
    delivered: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Service = mongoose.model('service', ServiceSchema);
module.exports = Service;