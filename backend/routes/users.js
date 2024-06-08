const express = require('express');
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



module.exports = router;