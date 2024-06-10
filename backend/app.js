const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connect = require('./db/mongo');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/users');
const userAuthRoutes = require('./routes/userAuth');
const tweetRoutes = require('./routes/tweets');

const app = express();

// we have use this to access coookies
app.use(cookieParser());

// use to parse incoming JSON data from HTTP requests
app.use(express.json());

const api = [
    apiVersion  = "v1",
    apiBasePath = "/twitterBackend" + "/" + apiVersion,
    version     = "2.0.0"
];

const PORT = process.env.PORT || 5000;

app.use(apiBasePath + "/api/auth" ,userAuthRoutes);
app.use(apiBasePath + "/api/users" ,userRoutes);
app.use(apiBasePath + "/api/tweets" ,tweetRoutes);

app.listen(PORT, () => {
    connect();
    console.log(`Server running on port ${PORT}`)
});
