const mongoose              = require("mongoose"),
      helpers               = require("../helpers"),
      passportLocalMongoose = require("passport-local-mongoose"),
      db                    = require(".");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "Name cannot be blank"
    },
    imageUrl: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        required: "Country cannot be blank"
    },
    city: {
        type: String,
        default: "Unknown"
    },
    email: {
        type: String,
        required: "Email cannot be blank",
        unique: true
    },
    completedTutorial: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "user"],
        default: "user"
    },
    uploads: [{type: mongoose.Schema.ObjectId, ref: 'Upload'}],
    trips: [{type: mongoose.Schema.ObjectId, ref: 'Trip'}],
});

userSchema.pre('updateOne', async function() {
    if (this._update.email && !helpers.isEmail(this._update.email)) {
        throw new Error('Invalid email');
    }
});
userSchema.pre('save', async function() {
    if (this.email && !helpers.isEmail(this.email)) {
        throw new Error('Invalid email');
    }
});
userSchema.pre('deleteOne', async function(next) {
    try {
        const id = this.getFilter()["_id"];
        let doc = await db.Enroll.findById(id);

        if (!doc) {
            throw `Document not found: User {_id: ${id}}`;
        }
        
        for (let upload of doc.uploads) {
            await db.Upload.deleteOne({_id: upload});
        }
        
        for (let trip of doc.trips) {
            await db.Trip.deleteOne({_id: trip});
        }        
    } 
    catch (err) {
        console.log("[ERROR] An error occured while deleting user (cascade)");
        console.log(err);
    }
    
    next();
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});

module.exports = mongoose.model("User", userSchema);