const mongoose  = require("mongoose"),
      db        = require(".");

const stopoverSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    author: {
        type: mongoose.Schema.ObjectId, ref: 'User',
        required: true
    },
    trip: {
        type: mongoose.Schema.ObjectId, ref: 'Trip',
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
    days: {
        type: Number,
        required: true
    }
});

stopoverSchema.pre('deleteOne', async function(next) {
    try {
        const id = this.getFilter()["_id"];
        let doc = await db.Stopover.findById(id).populate({ path: "trip", model: "Trip" });

        if (!doc) {
            throw `Document not found: Stopover {_id: ${id}}`;
        }
        
        if (doc.trip.stopovers.indexOf(id) === doc.trip.stopovers.length - 1) {
            await db.Segment.deleteOne({ to: id });
        }
        else {
            let toSegment = await db.Segment.findOne({ to: id });
            let fromSegment = await db.Segment.findOne({ from: id });

            if (!toSegment || !fromSegment) {
                throw "One of the segment pieces not found";
            }

            toSegment.to = fromSegment.to;
            await toSegment.save();

            await db.Segment.deleteOne({ id: fromSegment._id });
        }
    } 
    catch (err) {
        console.log("[ERROR] An error occured while deleting stopover (cascade)");
        console.log(err);
    }
    
    next();
});

module.exports = mongoose.model("Stopover", stopoverSchema);