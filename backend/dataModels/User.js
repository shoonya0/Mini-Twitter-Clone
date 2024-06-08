// Initiate mongoose, bcrypt
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// now here I have define schema for the users
const UserSchema = new mongoose.Schema({
        userName  : { type : String , require : true , unique : true },
        password  : { type : String ,require : true },
        email     : { type : String , require : true , unique : true },
        followers : [{ type : mongoose.Schema.Types.ObjectId , ref : 'User'}],
        following : [{ type : mongoose.Schema.Types.ObjectId , ref : 'User'}],
    },{ 
        timestamps : true 
    }
);

// now here I have define a method to compare the password
// this is a higher order function which is used to compare the password
UserSchema.pre('save', async function(next){
    const user = this;
    // if password is not modified then return nothing because password is already hashed else hash the password first
    if(!user.isModified('password')) 
        return next();
    else{
        // here we are salting the password which is a random string that used to hash the password
        const salt = await bcrypt.genSalt(20);
        // here we are hashing the password
        user.password = await bcrypt.hash(user.password, salt);
        next();
    }
});


module.exports = mongoose.model('User', UserSchema);