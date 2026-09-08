const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

function tokengenerator(userId){
    const token = jwt.sign({userId}, JWT_SECRET);
    
    return token;
}

function auth(req, res, next){
    const token = req.headers.token;

    try{
        const decoded = jwt.verify(token, JWT_SECRET);

        if(decoded){
            req.userId = decoded.userId;
            next();
        }else{
            res.status(403).send({
                status : false,
                message : "token mismatch"
            })
        }
    }catch(err){
        res.status(403).send({
            status : false,
            message : "invalid token"
        })
    }
}

module.exports = {tokengenerator, auth}