const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    safetyRating: {
        type: Number,
        required: true
    },
    destinations: [{type: mongoose.Schema.ObjectId, ref: 'Destination'}]
});

module.exports = mongoose.model("Country", countrySchema);