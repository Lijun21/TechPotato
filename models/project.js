var mongoose = require("mongoose");

//SCHEMA SETUP
var projectSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    createdAt: { type: Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    upvote: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vote"
        }
    ]
});

//make a moudle that use the schema above that have bunch of methods on it
module.exports = mongoose.model("Campground123", projectSchema);