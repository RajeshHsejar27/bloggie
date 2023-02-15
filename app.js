//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const homeStartingContent =
  "Good Day Everyone! This is my first blog!";
const aboutContent =
  "I have created this website as a part of my Backend developing basics and I hosted this via Heroku initially. I edited this page as a final version in which the stuff you can do with this website is shown. 1.Compose posts using Compose tab which will redirect u to homepage and it shows ur post and if its long it gets shortened out. 2.You can view all ur posts during the session in the homepage, then you can view the shortened posts in the homepage separately by clicking the 'Readmore'. 3. As the final update I gave the database connection finally which led the posts to save in the database and can be retrieved and viewed till the end of time. Seeya ya people,Till then!";
const contactContent = "You can contact me at nrh27magnum@gmail.com";

const app = express();
const MONGODB_URI =
  "mongodb+srv://somestuffhere.mongodb.net/?retryWrites=true&w=majority";

//change the above somestuff here with the necessary credentials

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose
  .connect(MONGODB_URI || "mongodb://localhost:27017/cluster0", {
    useNewUrlParser: true,
  })
  .then((connect) => console.log("connected to mongodb.."))
  .catch((e) => console.log("could not connect to mongodb", e));

module.exports = { mongoose };

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content,
    });
  });
});


app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
