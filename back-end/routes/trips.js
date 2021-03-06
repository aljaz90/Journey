const express     = require("express"),
      router      = express.Router(),
      db          = require("../models"),
      middleware  = require("../middleware");

router.post("/new", middleware.isLoggedIn, async (req, res) => {
    try {
        let trip = new db.Trip({ name: req.body.name || "Unnamed trip", from: req.body.from ? new Date(req.body.from) : null, author: req.user._id, stopovers: [], segments: []});
        await trip.save();

        req.user.trips.push(trip._id);
        await req.user.save();

        res.json(trip._doc);
    } 
    catch (err) {
        console.log("[ERROR] An error occured while creating a new trip");
        console.log(err);

        res.status(400).send("An error occured while creating a new trip");
    }
});

router.put("/:id", middleware.isLoggedIn, async (req, res) => {
    try {
        let trip = await db.Trip.findById(req.params.id);

        if (!trip) {
            throw `Document not found: Trip {_id: ${req.params.id}}`;
        }
        else if (!trip.author.equals(req.user._id)) {
            throw "Forbidden";
        }

        if (req.body.name && typeof req.body.name === "string") {
            trip.name = req.body.name;
        }
        
        if (req.body.from && typeof req.body.from === "string") {
            trip.from = req.body.from;
        }

        await trip.save();

        if (req.body.stopovers && Array.isArray(req.body.stopovers)) {
            for (let stopoverData of req.body.stopovers) {
                let stopover = await db.Stopover.findById(stopoverData._id);

                if (!stopover) {
                    throw `Document not found: Stopover {_id: ${stopoverData._id}}`;
                }
                else if (!stopover.author.equals(req.user._id)) {
                    throw "Forbidden";
                }

                if (stopoverData.name !== undefined && typeof stopoverData.name === "string") {
                    stopover.name = stopoverData.name;
                }
                if (stopoverData.lat !== undefined && typeof stopoverData.lat === "number") {
                    stopover.lat = stopoverData.lat;
                }
                if (stopoverData.long !== undefined && typeof stopoverData.long === "number") {
                    stopover.long = stopoverData.long;
                }
                if (stopoverData.days !== undefined && typeof stopoverData.days === "number") {
                    stopover.days = stopoverData.days;
                }
                
                await stopover.save();
            }
        }


        res.send("Success");
    } 
    catch (err) {
        console.log("[ERROR] An error occured while updating a trip");
        console.log(err);

        res.status(400).send("An error occured while updating a trip");
    }
});

router.delete("/:id", middleware.isLoggedIn, async (req, res) => {
    try {
        let trip = await db.Trip.findById(req.params.id);

        if (!trip) {
            throw `Document not found: Trip {_id: ${req.params.id}}`;
        }
        else if (!trip.author.equals(req.user._id)) {
            throw "Forbidden";
        }

        await db.Trip.deleteOne({ _id: trip._id });

        res.send("Success");
    } 
    catch (err) {
        console.log("[ERROR] An error occured while deleting a trip");
        console.log(err);

        res.status(400).send("An error occured while deleting a trip");
    }
});

// ROUTES FOR
// Stopovers + Segments 
router.post("/:id/stopover/new", middleware.isLoggedIn, async (req, res) => {
    try {
        let trip = await db.Trip.findById(req.params.id);

        if (!trip) {
            throw `Document not found: Trip {_id: ${req.params.id}}`;
        }
        else if (!trip.author.equals(req.user._id)) {
            throw "Forbidden";
        }

        let lat = 0;
        let long = 0;

        if (req.body.lat !== undefined && typeof req.body.lat === "number") {
            lat = req.body.lat;
        }
        if (req.body.long !== undefined && typeof req.body.long === "number") {
            long = req.body.long;
        }

        
        let segment = null;
        let stopover = new db.Stopover({ name: req.body.name || "Unknown stop", days: req.body.days || 1, author: req.user._id, trip: trip._id, lat: lat, long: long, destination: req.body.destination ? req.body.destination : null });
        await stopover.save();
        
        if (trip.stopovers.length > 0) {           
            segment = new db.Segment({ name: "", days: 1, type: "any", from: trip.stopovers[trip.stopovers.length - 1], to: stopover._id, duration: null });
            await segment.save();
            trip.segments.push(segment);
        }

        trip.stopovers.push(stopover);
        await trip.save();

        if (stopover.destination) {
            await db.Stopover.populate(stopover, { model: "Destination", path: "destination" });
        }

        res.json({stopover: stopover._doc, segment: segment ? segment._doc : undefined});
    } 
    catch (err) {
        console.log("[ERROR] An error occured while adding a new stopover");
        console.log(err);

        res.status(400).send("An error occured while adding a new stopover");
    }
});

router.delete("/:tripId/stopover/:id", middleware.isLoggedIn, async (req, res) => {
    try {
        let trip = await db.Trip.findById(req.params.tripId);

        if (!trip) {
            throw `Document not found: Trip {_id: ${req.params.tripId}}`;
        }
        else if (!trip.author.equals(req.user._id)) {
            throw "Forbidden";
        }

        if (!trip.stopovers.includes(req.params.id)) {
            throw "Stopover not found"
        }

        await db.Stopover.deleteOne({ _id: req.params.id });        
        trip.stopovers = trip.stopovers.filter(el => !el.equals(req.params.id));
        await trip.save();

        await db.Trip.populate(trip, { model: "Segment", path: "segments" });

        res.send(trip.segments);
    } 
    catch (err) {
        console.log("[ERROR] An error occured while deleting a stopover");
        console.log(err);

        res.status(400).send("An error occured while deleting a stopover");
    }
});

module.exports = router;