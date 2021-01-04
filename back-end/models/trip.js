const mongoose  = require("mongoose"),
      db        = require(".");

const tripSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.ObjectId, ref: 'User',
        required: true
    },
    stopovers: [{type: mongoose.Schema.ObjectId, ref: 'Stopover'}],
    routes: [{type: mongoose.Schema.ObjectId, ref: 'Route'}]
});

tripSchema.pre('deleteOne', async function(next) {
    try {
        const id = this.getFilter()["_id"];
        let doc = await db.Trip.findById(id);

        if (!doc) {
            throw `Document not found: Trip {_id: ${id}}`;
        }
        
        for (let stopover of doc.stopover) {
            await db.Stopover.deleteOne({ _id: stopover});
        }
    } 
    catch (err) {
        console.log("[ERROR] An error occured while deleting trip (cascade)");
        console.log(err);
    }
    
    next();
});

module.exports = mongoose.model("Trip", tripSchema);