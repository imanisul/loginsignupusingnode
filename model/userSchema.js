const mongoose = require('mongoose');
const { Schema } = mongoose;

const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    name: {
        type: String,
        required : [true, 'Name required'],
        minLenght: [5, 'Name should be of 5 char'],
        maxLenght:[50, 'Name should be less then 50 char'],
        trim: true
    },
    email: {
        type:String ,
        required  :[true, 'Email is required'],
        unique: [true, 'alreay registeredz'],
        lowercase: true,
    },
    password: {
        type:String,
        required   :true,
        select: false
    },
    forgetPasswordtoken: {
        type:String,
    },
    forgotPasswordExpiryDate: {
        type: Date
    }
},
{ timestamps: true

});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    return next();
})

userSchema.methods = {
    jwtToken(){
        return JWT.sign   (
            {id:this._id, email: this.email},
            process.env.SECERT,
            {expiresIn: '24h'}
        )
    }
}

const userModel = mongoose.model('user', userSchema);

module.exports= userModel;