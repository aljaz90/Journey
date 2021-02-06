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
    imageUrl: {
        type: String
    },
    description: {
        type: String,
        default: "No description yet"
    },
    currency: {
        type: String,
        default: "Unknown"
    },
    safetyRating: {
        type: Number,
        required: true
    },
    destinations: [{type: mongoose.Schema.ObjectId, ref: 'Destination'}]
});

module.exports = mongoose.model("Country", countrySchema);