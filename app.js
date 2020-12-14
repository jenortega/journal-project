//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const port = 3000;

mongoose.connect("mongodb://localhost:27017/posts", {useNewUrlParser: true});

//Notified if connection is successful
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function(){
  console.log("Connected")
});

//let posts = [];

//Schema
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    requiere: true
  },
  body: {
    type: String,
    requiere: true
  }
});

//Create model from Schema
const Post = mongoose.model("Post", postSchema);

const post1 = new Post({
  title: "Day One",
  body: "Today is December the 14th, of 20202."
});

// Post.deleteOne({_id: "5fd79eb6f9c7969aa4e18d67"}, function(err){
//   if(err){
//     console.log(err);
//   } else {
//     console.log("Successfully deleted post with no title.")
//   }
// });
//post1.save();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res){

  Post.find({}, function(err, foundPosts){
    console.log(foundPosts);
      res.render("home", {homeStartingContent: homeStartingContent, foundPosts: foundPosts});
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const postTitle = req.body.title
  const postBody = req.body.post

  const post = new Post({
    title: postTitle,
    body: postBody
  });

  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});

app.get("/posts/:postID", function(req, res) {
  let postURL = req.params.postID;

  Post.findOne({_id: postURL}, function(err, post){
    if (err) {
      console.log(err);
    } else {
      let theTitle = post.title;
      let theBody = post.body;
      res.render("post", {theTitle: theTitle, theBody: theBody});
    }
  })
})


// app.get("/posts/:day", function(req, res) {
//   let postURL = req.params.day;
//   let lowercaseURL = _.lowerCase(postURL);
//
//   posts.forEach(function(post) {
//     let theTitle = post.title;
//     let theBody = post.body;
//
//     let lowerTitle = _.lowerCase(theTitle);
//
//     if (lowercaseURL === lowerTitle) {
//       console.log("Match Found");
//       res.render("post", {theTitle: theTitle, theBody: theBody});
//
//     }
//   });
//
// });


app.listen(port, function() {
  console.log("Server started on port " + port);
});
