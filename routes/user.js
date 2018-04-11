var express = require("express");
var router  = express.Router();
var User    = require("../models/user");
var projectPosts  = require("../models/project");

// app.use("/", userRoutes);


router.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        projectPosts.find().where('author.id').equals(foundUser._id).exec(function(err, foundprojectPosts){
            if(err){
                req.flash("error", "Ops.. Can't find the user profile");
                return res.redirect("/campgrounds");
            } else {
                res.render("users/show", {user: foundUser, projectPosts: foundprojectPosts});
            }
        });
    });
});

 module.exports = router;