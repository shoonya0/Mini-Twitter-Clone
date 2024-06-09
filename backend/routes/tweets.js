const express = require('express');
const verifyToken = require('../middleware/auth');
const handleError = require('../middleware/error');
const Tweet = require('../dataModels/Tweets');
const User = require('../dataModels/User');

const router = express.Router();

// // Create a Tweet
router.post("/", verifyToken, async (req , res , next) => {
    // here we are creating a new tweet with the help of the tweet model
    const newTweet = new Tweet(req.body);

    // here we are saving the new tweet to the database
    try{
        const saveTweet = await newTweet.save();
        res.status(200).json(saveTweet);
    }catch(err){
        handleError(err);
    }
});

// Delete a Tweet
router.delete("/:id", verifyToken, async (req , res , next) => {
    try{
        // here we are finding the tweet with the help of the tweet model
        const tweet = await Tweet.findById(req.params.id);

        // here we are checking if the tweet has the id of the user that is deleting the tweet
        if(tweet.userId === req.body.id){
            await tweet.deleteOne();
            res.status(200).json("Tweet has been deleted...");
        }else{
            handleError(403, "You can delete only your tweet!");
        }
    }catch(err){
        handleError(500 ,err);
    }
});

// Like or Dislike a Tweet
router.put("/:id/like", async (req , res , next) => {
    try{
        // here we are finding the tweet with the help of the tweet model
        const tweet = await Tweet.findById(req.params.id);

        // here we are checking if the tweet has likes property and if the tweet has likes property then we are checking if the tweet has the id of the user that is liking the tweet
        if(!tweet.likes.includes(req.body.id)){
            await tweet.updateOne({ $push : { likes : req.body.id } });
            res.status(200).json("The tweet has been liked...");
        }else{
            await tweet.updateOne({ $pull : { likes : req.body.id } });
            res.status(200).json("The tweet has been disliked...");
        }
    }catch(err){
        handleError(500 ,err);
    }
});


// get all tweets of a user in all timeline
router.get("/timeline/:id", async (req , res , next) => {
    try{
        // here we are finding the current user with the help of the user model
        const currentUser = await User.findById(req.params.id);

        // here we are finding all the tweets of the current user and the users that the current user is following
        const userTweets = await Tweet.find({ userId : currentUser._id });

        // here we are finding all the tweets of the users that the current user is following
        const tweetFollowers = await Promise.all(
            currentUser.following.map((friendId) => {
                return Tweet.find({ userId : friendId });
            })
        );

        res.status(200).json(userTweets.concat(...tweetFollowers));
    }catch(err){
        handleError(500 ,err);
    }
});


// get user Tweets only
router.get("/user/all/:id", async (req , res , next) => {
    try{
        // here we are finding all the tweets of a user with the help of the tweet model
        const userTweerts = await Tweet.find({ userId : req.params.id }).sort({ createdAt : -1 });

        res.status(200).json(userTweerts);
    }catch(err){
        handleError(500 ,err);
    }
});

//explore
router.get("/explore", async (req , res , next) => {
    try{
        // here we are finding all the tweets that have likes property and sorting them in descending order
        const exploreTweets = await Tweet.find({
            likes: { $exists: true },
        }).sort({ likes: -1 });
    
        res.status(200).json(exploreTweets);
    }catch(err){
        handleError(500 ,err);
    }
});


module.exports = router;