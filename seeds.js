var test = {
    a: 1,
    b: 2,
    c: 3
}

console.log(test);



var mongoose = require("mongoose");
var project = require("./models/project");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest", 
        image: "https://coghillcartooning.files.wordpress.com/2014/02/fat-cat-businessman-cartoon-character-daily-sketch-coghill.jpg?w=640",
        description: "blah blah blah"
    },
    {
        name: "Desert Mesa", 
        image: "https://images.vexels.com/media/users/3/127288/isolated/preview/8cc049952971af91acaf407050c65919-businessman-cartoon-looking-at-front-by-vexels.png",
        description: "blah blah blah"
    },
    {
        name: "Canyon Floor", 
        image: "http://www.clker.com/cliparts/a/r/0/r/y/I/businessman-cartoon.svg",
        description: "blah blah blah"
    }
]

function seedDB(){
   //Remove all projects
   project.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed projects!");
         //add a few projects
        data.forEach(function(seed){
            project.create(seed, function(err, project){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a project");
                    //create a comment
                    // Comment.create(
                    //     {
                    //         text: "This place is great, but I wish there was internet",
                    //         author: "Homer"
                    //     }, function(err, comment){
                    //         if(err){
                    //             console.log(err);
                    //         } else {
                    //             project.comments.push(comment);
                    //             project.save();
                    //             console.log("Created new comment");
                    //         }
                    //     });
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;
