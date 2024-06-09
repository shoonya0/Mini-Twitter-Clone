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
module.exports = router;