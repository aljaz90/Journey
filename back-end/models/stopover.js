const mongoose = require("mongoose");

const stopoverSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    destination: {
        type: mongoose.Schema.ObjectId, 
        ref: 'Destination',
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