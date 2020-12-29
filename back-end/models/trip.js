const mongoose              = require("mongoose");

const tripSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

tripSchema.pre('deleteOne', async function(next) {
    try {
        /*
        const id = this.getFilter()["_id"];
        let doc = await db.Enroll.findById(id);

        if (!doc) {
            throw `Document not found: User {_id: ${id}}`;
        }
        */
    } 
    catch (err) {
        console.log("[ERROR] An error occured while deleting trip (cascade)");
        console.log(err);
    }
    
    next();
});

module.exports = mongoose.model("Trip", tripSchema);