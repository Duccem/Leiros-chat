const jwt = require('jsonwebtoken');
const { getConnection } =  require('../database');
const encriptar = require('../helpers/encript');
const { secret_key } = require('../keys')
controller = {};
const con = getConnection();

controller.signup = async (req,res)=>{
    try {
        let newUser = req.body;
        newUser.password = await encriptar.encriptar(newUser.password);
        let res = await con.query('INSERT INTO users set ?', [newUser]);
        let token = jwt.sign({id: res[0].insertId}, secret_key || '', {expiresIn: 60 * 60 * 24});
        res.cookie('token', token, { expire: new Date() + 60 * 60 * 24 }).redirect('/')
    } catch (error) {
        console.log(error);
        return res.redirect('/login')
    }
}

controller.login = async (req,res)=>{
    try {
        const response = await con.query(`SELECT * FROM users WHERE username = '${req.body.username}'`);
        const user = JSON.parse(JSON.stringify(response[0]));
        if(!user[0]) return res.redirect('/login');
        const valid = await encriptar.validar(req.body.password, user[0].password);
        if(!valid) return res.redirect('/login')
        let token = jwt.sign({id: user[0].id}, secret_key || '', {expiresIn: 60 * 60 * 24});
        res.cookie('token', token, { expire: new Date() + 60 * 60 * 24 }).redirect('/')
    } catch (error) {
        console.log(error);
        return res.redirect('/login')
    }
}


module.exports = controller;