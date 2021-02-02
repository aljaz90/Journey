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
    destination: {
        type: mongoose.Schema.ObjectId, ref: 'Destination',
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
        let doc = await db.Stopover.findById(id);

        if (!doc) {
            throw `Document not found: Stopover {_id: ${id}}`;
        }

        let trip = await db.Trip.findById(doc.trip);
        
        if (trip.stopovers.indexOf(id) === trip.stopovers.length - 1) {
            let segment = await db.Segment.findOne({ to: id });

            if (!segment) {
                return next();
            }

            await db.Trip.updateOne({ _id: trip._id }, { $set: { segments: trip.segments.filter(el => !el.equals(segment._id)) }});            
            await db.Segment.deleteOne({ _id: segment._id });
        }
        else if (trip.stopovers.indexOf(id) === 0) {
            let segment = await db.Segment.findOne({ from: id });

            if (!segment) {
                return next();
            }

            await db.Trip.updateOne({ _id: trip._id }, { $set: { segments: trip.segments.filter(el => !el.equals(segment._id)) }});            
            await db.Segment.deleteOne({ _id: segment._id });
        }
        else {
            let toSegment = await db.Segment.findOne({ to: id });
            let fromSegment = await db.Segment.findOne({ from: id });

            if (!toSegment || !fromSegment) {
                throw "One of the segment pieces not found";
            }

            toSegment.to = fromSegment.to;

            await toSegment.save();

            await db.Trip.updateOne({ _id: trip._id }, { $set: { segments: trip.segments.filter(el => !el.equals(fromSegment._id)) }});    
            await db.Segment.deleteOne({ _id: fromSegment._id });
        }
    } 
    catch (err) {
        console.log("[ERROR] An error occured while deleting stopover (cascade)");
        console.log(err);
    }
    
    next();
});

module.exports = mongoose.model("Stopover", stopoverSchema);