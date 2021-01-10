const mongoose = require("mongoose");

const segmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    from: {
        type: mongoose.Schema.ObjectId, 
        ref: 'Stopover',
        required: true
    },
    to: {
        type: mongoose.Schema.ObjectId, 
        ref: 'Stopover',
        required: true
    },
    duration: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Segment", segmentSchema);