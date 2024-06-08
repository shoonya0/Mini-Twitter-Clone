const express = require('express');
const createError = require('http-errors');
const handleError = require('../middleware/error');
const User = require('../dataModels/User');
const Tweet = require('../dataModels/Tweets');


const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const verifyToken = require('../middleware/auth');

const router = express.Router();

// Get User
router.get("/find/:id", async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    }catch (err) {
        next(err);
    }
});


// Update User
router.put("/:id", verifyToken ,async (req, res, next) => {
    if(req.params.id === req.body.id){
        try{
            // here we are updating the user with the help of id and setting the new data to the user
            const updateUser = await User.findByIdAndUpdate(
                // here we are finding the user by id
                req.params.id,
                {
                    // here we are setting the new data to the user
                    $set: req.body,
                },
                {
                    // we only want to attach the new data to the user by omitting the old data
                    new: true
                }
            );
            res.status(200).json(updateUser);
        }catch(err){
            next(err);
        }
    }else{
        return next(createError(403, "You can update only your account!"));
    }
});


// Delete User
router.delete("/:id", verifyToken, async (req, res, next) => {
    if(req.params.id === req.body.id){
        try{
            // here we are deleting the user by id
            await User.findByIdAndDelete(req.params.id);
            
            // here we are deleting the tweets of the user by userId
            await Tweet.deleteOne({userId: req.params.id});
            res.status(200).json("User has been deleted...");
        }catch(err){
            next(err);
        }
    }else{
        return next(handleError(403, "You can delete only your account!"));
    }
});

// Follow
router.put("/follow/:id", verifyToken, async (req ,res, next) => {
    try{
        // first user
        const firstUser = await User.findById(req.params.id);
        // second user
        const secondUser = await User.findById(req.body.id);

        // if the first user does not follow the second user
        if(!firstUser.followers.includes(req.body.id)){
            // here we are updating the first user by pushing the second user id to the followers array
            await firstUser.updateOne({
                $push: {
                    followers : req.body.id
                },
            });

            // here we are updating the second user by pushing the first user id to the following array
            await secondUser.updateOne({
                $push : {
                    following : req.params.id
                },
            });

            // here we are sending the response to the client that the user has been followed
            res.status(200).json("User has been followed...");
        }else{
            res.status(403).json("You already follow this user...");
        }
    }catch(err){
        next(err);
    }
});

// Unfollow
router.put("/unfollow/:id", verifyToken, async (req ,res, next) => {
    try{
        // first user
        const firstUser = await User.findById(req.params.id);
        // second user
        const secondUser = await User.findById(req.body.id);

        // if the first user follows the second user
        if(secondUser.following.includes(req.params.id)){
            // here we are updating the first user by pulling the second user id from the followers array
            await firstUser.updateOne({
                $pull: {
                    followers : req.body.id
                }
            });
            
            // here we are updating the second user by pulling the first user id from the following array
            await secondUser.updateOne({
                $pull: {
                    following : req.params.id
                }
            });
        }else{
            res.status(403).json("You don't follow this user...");
        }
    }catch(err){
        next(err);
    }
});


module.exports = router;