 
 var express = require('express');
 var path = require('path');
 var bodyParser = require('body-parser');
 var mongoose = require('mongoose');
 var Movie = require('./models/movie');
 var User = require('./models/user');
 var _ = require('underscore');
 var port = process.env.PORT || 3003;
 var app = express();
 
 app.locals.moment = require('moment');
 //连接数据库
 mongoose.Promise = global.Promise;
 mongoose.connect("mongodb://localhost/movies");
 //视图根目录
 app.set('views' , './views/pages');
 //设置引擎模板
 app.set('view engine', 'jade');
 //表单数据格式化
 app.use(bodyParser());
 //静态资源位置
 app.use(express.static(path.join(__dirname , 'public')));
 //监听端口
 app.listen(port);
 //开启路由
 app.get('/' , function(req , res){
	 Movie.fetch(function(err , movies){
		 if(err){
			 console.log(arr);
		 }
		 res.render('index' , {title : 'magic',
							   movies : movies
							  });
	 });
	 
 });
 app.get('/movie/:id' , function(req , res){
	 var id = req.params.id;
	 
	 Movie.findById(id , function(err , movie){
		 if(err){
			 console.log(arr);
		 }
		 res.render('detail' , {title : 'detail',
								movie: movie
							});
	 });
	 
 });
 app.get('/admin/movie' , function(req , res){
	 res.render('admin' , {title : 'admin 后台录入页',
						   movie: {
							   title : '',
							   actor : '',
							   country :'',
							   year : '',
							   poster : '',
							   flash : '',
							   summary : '',
							   language : ''
						   }
							
							});
 });
 //更新按钮路由
 app.get('/admin/update/:id' , function(req , res){
	 var id = req.params.id;
	 if(id){
		 Movie.findById(id , function(err , movie){
			 res.render('admin' , {
				 title : '后台更新',
				 movie : movie
			 });
		 });
	 }
 });
 //后台录入数据路由
 app.post('/admin/movie/new' , function(req , res){
	 var id = req.body.movie._id;
	 var movieObj = req.body.movie;
	 var _movie;
	 if(id !== 'undefined'){
		 Movie.findById(id , function(err , movie){
			if(err){
				console.log(err);
			}
			_movie = _.extend(movie , movieObj);
			_movie.save(function(err , movie){
				if(err){
					console.log(err);
				}
				res.redirect('/movie/' + movie._id);
			});
		});
	 }else {
		 _movie = new Movie({
			 actor : movieObj.actor,
			 title : movieObj.title,
			 country : movieObj.country,
			 language : movieObj.language,
			 year : movieObj.year,
			 poster : movieObj.poster,
			 summary : movieObj.summary,
			 flash : movieObj.flash
		 });
		 
		 _movie.save(function(err , movie){
				if(err){
					console.log(err);
				}
				res.redirect('/movie/' + movie._id);
			});
	 }
 });
 //movielist
 app.get('/admin/list' , function(req , res){
	 Movie.fetch(function(err , movies){
		 if(err){
			 console.log(arr);
		 }
		 res.render('list' , {title : 'list',
							  movies : movies
							});
	 });
	 
 });
 //userlist
  app.get('/admin/userList' , function(req , res){
	 User.fetch(function(err , users){
		 if(err){
			 console.log(arr);
		 }
		 res.render('userList' , {title : 'userlist',
							  users : users
							});
	 });
	 
 });
 //删除按钮路由
 app.delete('/admin/list' , function(req , res){
	 var id = req.query.id;
	 if(id){
		 Movie.remove({_id : id} , function(err , movie){
			if(err){
				console.log(err);
			}else{
				res.json({success : 1});
			}
		 });
	 }
 });
 //前台注册路由
 app.post('/user/signup' , function(req , res){
	 var _user = req.body.user;
	 
	 User.find({name : _user.name},function(err , user){
		 if(err){
			 console.log(err);
		 }
		 if(user.name){
			 console.log(user.name);
			 res.redirect('/');
		 }else{
			 var user = new User(_user);
			 user.save(function(err , user){
				 if(err){
					 console.log(err);
				 }
			 });
			 res.redirect('/');
		 }
	 });
	 
 });
 
 //前台登录路由
 app.post('/user/signin' , function(req , res){
	 var _user = req.body.user;
	 var name = _user.name;
	 var password = _user.password;
	 User.findOne({name : name} , function(err , user){
		 if(err){
			 console.log(err);
		 }
		 if(!user){
			 console.log('user is not exist');
		 }
		 user.comparePassword(password , function(err , isMatch){
			 if(err){
				 console.log(err);
			 }
			 if(isMatch){
				 return res.redirect('/');
			 }else{
				 console.log('Password is not matched');
			 }
		 });
	 });
 });
 console.log('movie stared on 139.199.168.15:3003');