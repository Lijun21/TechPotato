var express = require("express");
var router  = express.Router();
var User    = require("../models/user");

// app.use("/", userRoutes);


router.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        // eval(require('locus'));
        if(err){
            req.flash("error", "Ops.. Can't find the user profile");
            console.log("123");
            console.log(err.message);
            return res.redirect("/campgrounds");
        } else {
            res.render("users/show", {user: foundUser});
        }
    });
});

 module.exports = router;