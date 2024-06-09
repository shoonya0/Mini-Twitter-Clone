const express = require('express');
const verifyToken = require('../middleware/auth');
const handleError = require('../middleware/error');
const Tweet = require('../dataModels/Tweets');
const User = require('../dataModels/User');

const router = express.Router();

// // Create a Tweet
router.post("/", verifyToken, async (req , res , next) => {
    const newTweet = new Tweet(req.body);
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
        const tweet = await Tweet.findById(req.params.id);
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
        const tweet = await Tweet.findById(req.params.id);
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
        const currentUser = await User.findById(req.params.id);
        const userTweets = await Tweet.find({ userId : currentUser._id });
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
        const userTweerts = await Tweet.find({ userId : req.params.id }).sort({ createdAt : -1 });
        res.status(200).json(userTweerts);
    }catch(err){
        handleError(500 ,err);
    }
});



module.exports = router;