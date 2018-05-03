var mongoose = require("mongoose");

//SCHEMA SETUP
var projectSchema = new mongoose.Schema({
    name: String,
    link: String,
    techUsed: String,
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

module.exports = mongoose.model("Project", projectSchema);