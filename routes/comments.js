var express = require("express");
var router  = express.Router({mergeParams: true});
var ProjectDB = require("../models/project");
var Comment = require("../models/comment");
var Middleware = require("../middleware");

// app.use("/projects/:id/comments", commentRoutes);

//Show new comment form to create new comment
router.get("/new", Middleware.isLoggedIn, function(req, res){
    // find project by id
    ProjectDB.findById(req.params.id, function(err, project){
        if(err){
            req.flash("error", "Ops.. Can't find the data :(");
            console.log(err);
        } else {
             res.render("comments/new", {project: project});
        }
    })
});

//CREATE - create new comment to DB
router.post("/", Middleware.isLoggedIn, function(req, res){
   //lookup project using ID
   ProjectDB.findById(req.params.id, function(err, project){
       if(err){
           req.flash("error", "Ops.. Can't find the data :(");
           console.log(err);
           res.redirect("/projects");
       } else {
           //create new comment
        //    eval(require('locus'));
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Ops.. Can't find the data :(");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //connect new comment to project
                    project.comments.push(comment);
                    project.save();
                    //redirect project show page
                    req.flash("success", "You comment has been added");
                    return res.redirect('/projects/' + project._id);
                }
        });
       }
   });
});

// app.use("/projects/:id/comments", commentRoutes);

//Edit - show comment edit form 
router.get("/:comment_id/edit", Middleware.checkCommentOwnership, function(req, res){
    ProjectDB.findById(req.params.id, function(err, foundproject){
        if (err){
            req.flash("error", "Ops.. Can't find the data :(");
            console.log(err);
        } else {
            Comment.findById(req.params.comment_id, function(err, foundComment){
                res.render("comments/edit", {comment: foundComment, project : foundproject});
            });
        }
    })
});


//UPDATE - update the comment in project
router.put("/:comment_id", Middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if (err){
            req.flash("error", "Ops.. Can't find the data :(");
            console.log(err);
        } else {
            res.redirect("/projects/" + req.params.id);
        }
    });
});


//DESTROY - delete the Comment inside certain project 
router.delete("/:comment_id", Middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err){
            req.flash("error", "Ops.. Can't find the data :(");
            console.log(err);
        } else {
            req.flash("success", "You comment has been deleted");
            res.redirect("/projects/" + req.params.id);
        }
    });
});

module.exports = router;

