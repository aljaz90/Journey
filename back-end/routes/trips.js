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

module.exports = router;