var express = require("express");
var router  = express.Router();
var ProjectDB = require("../models/project");
var Upvote = require("../models/vote");

router.post("/projects/:_id/vote", function(req, res){
    //find that projct
    //add the username to vote username
    ProjectDB.findById(req.params.id, function(err, projectFound){
        if (err){
            req.flash("error", "Ops.. Can't find the data :(");
            console.log(err);
            res.redirect("/projects");
        }else{
            Upvote.create({}, function(err, vote){
                if (err){
                    console.log(err);
                }else{
                    // eval(require('locus'));
                    //req.user = undefined??
                    vote.upvoter.id = req.user._id;
                    vote.upvoter.username = req.user.username;
                    vote.save();
                    //connect new vote to project
                    projectFound.upvote.push(vote);
                    projectFound.save();
                    //redirect project show page
                    req.flash("success", "You vote has been added");
                    return res.redirect('/projects/' + projectFound._id);
                }
            })
        }
    })

})

module.exports = router;