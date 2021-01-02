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
    }
});

module.exports = mongoose.model("Destination", destinationSchema);