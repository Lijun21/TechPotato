var express = require("express");
var router  = express.Router();
var ProjectDB = require("../models/project");
var Middleware = require("../middleware");

//app.use("/projects", projectRoutes);

//Index - show all projects
router.get("/", function(req, res){
    var search = req.query.search;
    if (search){
        // eval(require('locus'));
        ProjectDB.find({name: search}, function(err, Findproject){
            if(err){
                console.log(err);
                res.render("projects/index", {projects:{}, page: 'projects'});
            }else{
                res.render("projects/index", {projects:Findproject, page: 'projects'});
            }
        })
    }else{
        ProjectDB.find({}, function(err, allproject){
            if (err){
                console.log(err);
            }else{
                res.render("projects/index", {projects:allproject, page: 'projects'});
            }
        });
    }
});

//GET/New - show from to create new project
router.get("/new/", Middleware.isLoggedIn, function(req, res){
    res.render("projects/new");
})

//POST/Create - add new project to DB
router.post("/", Middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    var newproject = {name: name, image: image, description:desc, author: author};
    ProjectDB.create(newproject, function(err, newlyCreated){
        if (err || !newlyCreated){
            console.log(err);
        }else {
            req.flash("success", "You new project has been Created =)");
            res.redirect("/projects");
        }
    });
});

//GET/SHOW - shows more info about one project
router.get("/:id", function(req, res){
    ProjectDB.findById(req.params.id).populate("comments").exec(function(err, foundproject){
        if (err){
            console.log(err);
        } else {
            res.render("projects/show", {project:foundproject});
        }
    });
});

//GET/Edit - show edit form for a project
router.get("/:id/edit", Middleware.checkprojectOwnership, function(req, res){
    ProjectDB.findById(req.params.id, function(err, foundproject){
        res.render("projects/edit", {project: foundproject});
    });
});

// PUT - update campgournd in the DB
router.put("/:id", Middleware.checkprojectOwnership, function(req, res){
    // find and update the correct project
    ProjectDB.findByIdAndUpdate(req.params.id, req.body.project, function(err, updatedproject){
       if(err || !updatedproject){
           res.redirect("/projects");
       } else {
           //redirect somewhere(show page)
           res.redirect("/projects/" + req.params.id);
       }
    });
});

//DELETE - removes project and its comments from the database
router.delete("/:id", Middleware.checkprojectOwnership, function(req, res){
    ProjectDB.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("/projects");
        } else {
            res.redirect("/projects");
        }
    })
});

module.exports = router;