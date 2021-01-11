const mongoose  = require("mongoose"),
      CONFIG    = require("../config/config");

const routeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: CONFIG.ROUTE.TYPES
    },
    from: {
        type: mongoose.Schema.ObjectId, 
        ref: 'Destination',
        required: true
    },
    to: {
        type: mongoose.Schema.ObjectId, 
        ref: 'Destination',
        required: true
    },
    duration: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Route", routeSchema);