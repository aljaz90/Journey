const express     = require("express"),
      router      = express.Router(),
      db          = require("../models"),
      middleware  = require("../middleware");

router.post("/new", middleware.isLoggedIn, async (req, res) => {
    try {
        let trip = new db.Trip({ name: "Unnamed trip", author: req.user._id, stopovers: [], routes: []});
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

                if (stopoverData.name && typeof stopoverData.name === "string") {
                    stopover.name = stopoverData.name;
                }
                if (stopoverData.lat && typeof stopoverData.lat === "number") {
                    stopover.lat = stopoverData.lat;
                }
                if (stopoverData.long && typeof stopoverData.long === "number") {
                    stopover.long = stopoverData.long;
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

        if (req.body.lat && typeof req.body.lat === "number") {
            lat = req.body.lat;
        }
        if (req.body.long && typeof req.body.long === "number") {
            long = req.body.long;
        }

        
        let stopover = new db.Stopover({ name: "Unknown stop", days: 1, author: req.user._id, lat: lat, long: long, days: 1 });
        console.log(req.body)
        await stopover.save();

        trip.stopovers.push(stopover);
        await trip.save();

        res.json(stopover._doc);
    } 
    catch (err) {
        console.log("[ERROR] An error occured while adding a new stopover");
        console.log(err);

        res.status(400).send("An error occured while adding a new stopover");
    }
});

module.exports = router;