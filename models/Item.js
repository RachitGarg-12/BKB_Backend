const mongoose = require('mongoose');
const { Schema } = mongoose;

const ItemSchema = new Schema({
    itemCode: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    imgLink: {
        type: Array,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    used: {
        type: String,
        required: true,
        default: "No Reviews Yet"
    },
    description: {
        type: Array,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const item = mongoose.model('item', ItemSchema);
module.exports = item;