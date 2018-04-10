var express = require("express");
var router  = express.Router({mergeParams: true});
var PotatoDB = require("../models/potato");
var Comment = require("../models/comment");
var Middleware = require("../middleware");

// app.use("/potatos/:id/comments", commentRoutes);

//Show new comment form to create new comment
router.get("/new", Middleware.isLoggedIn, function(req, res){
    // find potato by id
    PotatoDB.findById(req.params.id, function(err, potato){
        if(err){
            req.flash("error", "Ops.. Can't find the data :(");
            console.log(err);
        } else {
             res.render("comments/new", {potato: potato});
        }
    })
});

//CREATE - create new comment to DB
router.post("/", Middleware.isLoggedIn, function(req, res){
   //lookup potato using ID
   PotatoDB.findById(req.params.id, function(err, potato){
       if(err){
           req.flash("error", "Ops.. Can't find the data :(");
           console.log(err);
           res.redirect("/potatos");
       } else {
           //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Ops.. Can't find the data :(");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //connect new comment to potato
                    potato.comments.push(comment);
                    potato.save();
                    //redirect potato show page
                    req.flash("success", "You comment has been added");
                    return res.redirect('/potatos/' + potato._id);
                }
        });
       }
   });
});

// app.use("/potatos/:id/comments", commentRoutes);

//Edit - show comment edit form 
router.get("/:comment_id/edit", Middleware.checkCommentOwnership, function(req, res){
    PotatoDB.findById(req.params.id, function(err, foundpotato){
        if (err){
            req.flash("error", "Ops.. Can't find the data :(");
            console.log(err);
        } else {
            Comment.findById(req.params.comment_id, function(err, foundComment){
                res.render("comments/edit", {comment: foundComment, potato : foundpotato});
            });
        }
    })
});


//UPDATE - update the comment in potato
router.put("/:comment_id", Middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if (err){
            req.flash("error", "Ops.. Can't find the data :(");
            console.log(err);
        } else {
            res.redirect("/potatos/" + req.params.id);
        }
    });
});


//DESTROY - delete the Comment inside certain potato 
router.delete("/:comment_id", Middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err){
            req.flash("error", "Ops.. Can't find the data :(");
            console.log(err);
        } else {
            req.flash("success", "You comment has been deleted");
            res.redirect("/potatos/" + req.params.id);
        }
    });
});

module.exports = router;

