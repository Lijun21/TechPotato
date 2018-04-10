var express = require("express");
var router  = express.Router();
var PotatoDB = require("../models/potato");
var Middleware = require("../middleware");

//app.use("/potatos", potatoRoutes);

//Index - show all potatos
router.get("/", function(req, res){
    //get all potato from DB
    PotatoDB.find({}, function(err, allpotato){
        if (err){
            console.log(err);
        }else{
            res.render("potatos/index", {potatos:allpotato, page: 'potatos'});
        }
    });
});

//GET/New - show from to create new potato
router.get("/new/", Middleware.isLoggedIn, function(req, res){
    res.render("potatos/new");
})

//POST/Create - add new potato to DB
router.post("/", Middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    var newpotato = {name: name, image: image, description:desc, author: author};
    PotatoDB.create(newpotato, function(err, newlyCreated){
        if (err || !newlyCreated){
            console.log(err);
        }else {
            req.flash("success", "You new project has been Created =)");
            res.redirect("/potatos");
        }
    });
});

//GET/SHOW - shows more info about one potato
router.get("/:id", function(req, res){
    PotatoDB.findById(req.params.id).populate("comments").exec(function(err, foundpotato){
        if (err){
            console.log(err);
        } else {
            res.render("potatos/show", {potato:foundpotato});
        }
    });
});

//GET/Edit - show edit form for a potato
router.get("/:id/edit", Middleware.checkpotatoOwnership, function(req, res){
    PotatoDB.findById(req.params.id, function(err, foundpotato){
        res.render("potatos/edit", {potato: foundpotato});
    });
});

// PUT - update campgournd in the DB
router.put("/:id", Middleware.checkpotatoOwnership, function(req, res){
    // find and update the correct potato
    PotatoDB.findByIdAndUpdate(req.params.id, req.body.potato, function(err, updatedpotato){
       if(err || !updatedpotato){
           res.redirect("/potatos");
       } else {
           //redirect somewhere(show page)
           res.redirect("/potatos/" + req.params.id);
       }
    });
});

//DELETE - removes potato and its comments from the database
router.delete("/:id", Middleware.checkpotatoOwnership, function(req, res){
    PotatoDB.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("/potatos");
        } else {
            res.redirect("/potatos");
        }
    })
});

module.exports = router;