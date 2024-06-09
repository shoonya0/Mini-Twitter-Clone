const express = require('express');
const verifyToken = require('../middleware/auth');
const handleError = require('../middleware/error');
const Tweet = require('../dataModels/Tweets');

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

module.exports = router;