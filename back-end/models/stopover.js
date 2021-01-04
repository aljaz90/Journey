const mongoose = require("mongoose");

const stopoverSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    lat: {
        type: Number,
        required: true
    },
    long: {
        type: Number,
        required: true
    },
    begin: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("Stopover", stopoverSchema);