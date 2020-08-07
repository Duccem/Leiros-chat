const jwt = require('jsonwebtoken');
const { getConnection } =  require('../database');
const encriptar = require('../helpers/encript');
controller = {};
const con = getConnection();

controller.signup = async (req,res)=>{
    try {
        let newUser = req.body;
        newUser.password = await encriptar.encriptar(newUser.password);
        let { insertId } = await con.query('INSERT INTO users ?', [newUser]);
        let token = jwt.sign({id: insertId}, '2423503', {expiresIn: 60 * 60 * 24});
        res.cookie('token', token, { expire: new Date() + 60 * 60 * 24 }).redirect('/')
    } catch (error) {
        console.log(error);
        return res.redirect('/')
    }
}

controller.login = async (req,res)=>{
    try {
        const response = await con.query(`SELECT * FROM users WHERE nick = '${req.body.nick}'`);
        const user = JSON.parse(response[0]);
        if(!user[0]) return res.redirect('/login');
        const valid = await encriptar.validar(req.body.password, user[0].password);
        if(!valid) return res.redirect('/login')
        let token = jwt.sign({id: user[0].ID}, '2423503', {expiresIn: 60 * 60 * 24});
        res.cookie('token', token, { expire: new Date() + 60 * 60 * 24 }).redirect('/')
    } catch (error) {
        console.log(error);
        return res.redirect('/')
    }
}


module.exports = controller;