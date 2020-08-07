const jwt = require('jsonwebtoken');
const {jsonwebtoken} = require('../keys');

async function verify(req,res,next){
    try {
        let token = req.cookies['token'];
        if (!token) return res.redirect('/login');
        let decode = await jwt.verify(token, jsonwebtoken.key);
        req.user_id = decode.id;
        next();
    } catch (error) {
        if(error.message==='jwt expired') return res.clearCookie('token').redirect('/login');
    }
}
async function logedin (req,res,next){
    try {
        let token = req.cookies.token;
        if (token) return res.redirect('/');
        next();
    } catch (error) {
        if(error.message==='jwt expired') next();
    }
}

module.exports = {verify,logedin};