var mongoose = require("mongoose");

var voteSchema = mongoose.Schema({
    createdAt: { type: Date, default: Date.now},
    upvoter: {
        id: mongoose.Schema.Types.ObjectId,
        username: String
    }
});

module.exports = mongoose.model("Vote", voteSchema);