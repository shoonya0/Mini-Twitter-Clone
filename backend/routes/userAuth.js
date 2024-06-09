
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const handleError = require('../middleware/error');
const User = require('../dataModels/User');

const router = express.Router();

// signup
// here we are creating a new useer with the help of the user model
router.post("/signup", async (req , res, next) => {
    try{
        // here salt is a random string that is used to hash the password
        const salt = bcrypt.genSalt(50);

        // here we are hashing the password with the help of bcrypt library
        const hash = bcrypt.hashSync(req.body.password ,salt);

        // here we are creating a new user with the help of the user model
        const newUser = new User({ ...req.body, password : hash});

        // here we are saving the new user to the database
        await newUser.save();

        // here we are creating a token with the help of jwt library
        // jwt.sign() takes three arguments
        // 1. payload : the data that we want to store in the token
        // 2. secret : the secret key that is used to sign the token
        // 3. callback : a callback function that takes two arguments
        const token = jwt.sign(
            { id : newUser._id, userName : newUser.userName,},
            process.env.JWT_SECRET,
            (err, asyncToken) => {
                if(err) throw err;
                console.log(asyncToken);
                res.status(200).json({ token, user : newUser});
            }
        );

        // here we are destructuring the password from the user object
        const { password, ...otherData } = newUser._doc;

        // here we are setting the cookie with the help of res.cookie() method that takes three arguments
        // 1. name : the name of the cookie
        // 2. value : the value of the cookie
        // 3. options : the options that we want to set to the cookie
        res.cookie("access_token" ,token 
        //     ,{
        //     httpOnly : true ,
        //     sameSite : true,
        // }
        ).status(200)
        .json(otherData);
    }catch(err){
        next(err);
    }
});




module.exports = router;