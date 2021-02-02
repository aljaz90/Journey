const express     = require("express"),
      router      = express.Router(),
      db          = require("../models"),
      middleware  = require("../middleware");

router.post("/new", middleware.isLoggedIn, middleware.isAdmin, async (req, res) => {
    try {
        let destination = new db.Destination({ name: req.body.name, lat: req.body.lat, long: req.body.long, imageUrl: req.body.imageUrl, description: req.body.description, recommendedDays: req.body.recommendedDays, rating: req.body.rating, country: req.body.country, tags: req.body.tags });
        await destination.save();
        res.json(destination._doc);
    } 
    catch (err) {
        console.log("[ERROR] An error occured while creating a new destination");
        console.log(err);

        res.status(400).send("An error occured while creating a new destination");
    }
});

module.exports = router;