const express = require('express');
const createError = require('http-errors');
const handleError = require('../middleware/error');
const User = require('../dataModels/User');

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
router.put("/:id", async (req, res, next) => {
    if(req.params.id === req.body.id){
        try{
            const updateUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                {
                    new: true
                }
            );
            res.status(200).json(updateUser);
        }catch(err){
            next(err);
        }
    }else{
        return next(createError(401, "You can update only your account!"));
    }
});



module.exports = router;