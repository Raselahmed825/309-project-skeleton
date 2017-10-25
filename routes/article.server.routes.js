module.exports = function(app){

 var articles = require('./../controllers/articles.server.controller.js');
 var users = require('./../controllers/users.server.controller.js');


app.route('/articles/new')
.get(articles.new);

app.route('/articles/all')
    .get(articles.all);
    
app.route('/articles/:articleId')
    .get(articles.view);

app.route('/articles/edit/:articleId')
    .get(articles.edit);


 app.route('/api/articles')
	.get(articles.list)
	.post(users.requiresLogin, articles.create);

  app.route('/api/articles/:articleId')
	.get(articles.read)
  .delete(users.requiresLogin, articles.delete);

	app.route('/api/articles/edit/:articleId')
	.get(articles.read)
	.put(users.requiresLogin, articles.update);
	


app.param('articleId', articles.articleByID);


}

exports.articleByID = function(req, res,next,id){
    Article.findById(id).populate('user','email').exex(function(err,article){
        if(err)return next(err);
        if(!article) return next (new Error('Failed to load article ' + id));
        req.article = article;
        next();
        
    });
};

exports.view = function (req,res) {
        res.render('./../views/article/view.ejs',{
            user:req.user || null,
            request:req
        });
};

exports.edit =function(req,res){
    res.render('./../public/views/article/edit.ejs')
}


exports.all = function(req,res){
    Article.find(function(err,data){
    if(err){
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    }else{
        console.log("api called");
        res.render('./../public/views/article/all.ejs',{
            user: req.user || null,
            request: req,
            articles: data
        });
    }
        
    });
};


