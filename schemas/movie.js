var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
	actor : String,
	title : String ,
	language : String,
	country : String,
	summary : String,
	flash : String,
	poster : String,
	year : Number,
	meta : {
		createAt : {
			type : Date,
			default : Date.now()
		},
		updateAt : {
			type : Date,
			default : Date.now()
		}
	}
});
//每次save后调用
MovieSchema.pre('save' , function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else {
		this.meta.updateAt = Date.now();
	}
	next();
});
//静态方法 不会与数据库交互 需要经过moudel

MovieSchema.statics = {
	fetch : function(cb){
		return this.find({})
		.sort('meta.updateAt')
		.exec(cb);
	},
	findById : function(id , cb){
		return this.findOne({_id: id})
		.exec(cb);
	}
};

module.exports = MovieSchema;

