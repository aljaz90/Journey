const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    long: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    recommendedDays: {
        type: Number,
        default: 1
    },
    country: {
        type: mongoose.Schema.ObjectId, 
        ref: 'Country',
        required: true
    },
    tags: [{ type: String }]    
});

module.exports = mongoose.model("Destination", destinationSchema);