const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://ywgwork:yash@mongo@cluster0.uw9xgmc.mongodb.net/wikiDB?retryWrites=true&w=majority", {useNewUrlParser: true});
const articleSchema = {
    title: String,
    content: String
};
const Article = mongoose.model("Article", articleSchema);

// Requests targeting all articles

app.route("/articles")
.get(function(req, res){
    Article.find(function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        }else{
            res,send(err);
        }
        
        });
})
.post(function(req,res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added a new article");
        }else{
            res.send(err);
        }
    });
})
.delete( function(req ,res){
    Article.deleteMany({}).then(function (){
        res.send("successfully deleted all articles");
        }) .catch(err =>{
            res.send(err);
    });
});
// Requests targeting a specific article
app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title:req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle)
        }else{
            res.send("No Articles matching that title was found.")
        }
    });
})
.put( function(req,res){
    Article.replaceOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        function(err){
            if(!err){
                res.send("Successfully updated article");
            }else{
                res.send(err);
            }
        }
        );
})
.patch(function(req,res){
    Article.updateOne({title: req.params.articleTitle}, 
        req.body, 
        function(err, response){
            if (!err) {
                res.send(`Article ${req.params.articleTitle} has been updated.`);
            }
    });
})
.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Successfully deleted the corresponding article");
            }else{
                res.send(err);
            }
        }
        );
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});