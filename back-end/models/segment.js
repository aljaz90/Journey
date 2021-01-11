const mongoose  = require("mongoose"),
      CONFIG    = require("../config/config");

const segmentSchema = new mongoose.Schema({
    name: {
        type: String
    },
    type: {
        type: String,
        required: true,
        enum: CONFIG.ROUTE.TYPES
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
        type: Number
    }
});

module.exports = mongoose.model("Segment", segmentSchema);