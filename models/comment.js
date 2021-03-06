var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now},
    author: {
        id: mongoose.Schema.Types.ObjectId,
        username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);