	

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
 //message schema
let UserSchema = new Schema({
     id : {
		 type : Number, unique:true
		},
	name:{
		type:String,default:''
	},
	password:{
		type:String,default:'',

	},
	username:{
		type:String,default:''
	},
	email : {
		type : String, default: ''
	},
	address:{
		street:{
			type:String,default:''
		},
		suite:{
			type:String,default:''
		},
		city:{
			type:String,default:''
		},
		zipcode:{
			type:String,default:''
		},
		geo:{
			lat:{
				type:String,default:''
			},
			lng:{
				type:String,default:''
			}
		}
	},
	phone : {
			type : String, default: ''
		 },
	website:{
			type:String,default:''
		 },
	company:{
			name:{
				type:String,default:''
			},
		    catchPhrase:{
				type:String,default:''
			},
		    bs:{
				type:String,default:''
			}
	},


	});


// Export the model
module.exports = mongoose.model('User', UserSchema);