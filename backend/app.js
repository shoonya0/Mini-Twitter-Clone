const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const connect = require('./db/mongo');

const app = express();

const api = [
    apiVersion  = "v1",
    apiBasePath = "/twitterBackend" + apiVersion + "/",
    version     = "2.0.0"
];

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connect();
    console.log(`Server running on port ${PORT}`)
});
