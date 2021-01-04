const mongoose = require("mongoose");

const stopoverSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    author: {
        type: mongoose.Schema.ObjectId, ref: 'User',
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