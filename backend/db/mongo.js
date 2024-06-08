const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Load config
dotenv.config();

// Connect to database
function connect (){
    mongoose.connect(process.env.MongoDb)
    .then(() => {
        console.log('Mongoose DB Connected');
    })
    .catch(err => 
        console.log(err)
    );
}

module.exports = connect;