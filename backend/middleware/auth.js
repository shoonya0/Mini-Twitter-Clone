// this is a middleware to verify the json web token
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const handleError = require('./error');

function auth(req ,res ,next){
    // const token = req.header('x-auth-token');
    const token = req.cookies.access_token;

    if(!token)
        // return res.status(401).json({msg : "No token ,authorization denied"});
        return next(handleError(401 ,"you are not authorized to access this route"));
    
    jwt.verify(token ,process.env.JWT_SECRET , (err , user) => {
        if(err) return next(createError(403, "Token is invalid"));
        req.user = user;
        next();
    });

    // try{
    //     const decoded = jwt.verify(token , process.env.JWT_SECRET);
    //     req.user = decoded;
    //     next();
    // }catch(e){
    //     res.status(400).json({msg : "Token is not valid"});
    // }
}

module.exports = auth;