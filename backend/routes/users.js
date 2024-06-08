const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get("/", (req, res) => {
    res.send('Hello from users');
});

module.exports = router;