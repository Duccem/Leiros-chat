const { getConnection } =  require('../database');
controller = {};
const con = getConnection()
controller.index = async(req,res) => {
    const response = await con.query('SELECT * FROM grupos');
    const grupos = JSON.parse(response[0])
    const model = {};
    model.grupos = grupos;
    return res.render('index', model);
}

controller.login = async (req, res) => {
    return res.clearCookie('token').render('login');
};

controller.signup = async (req,res) =>{
    return res.clearCookie('token').render('signup');
}

controller.logout = async (req,res) => {
    return res.clearCookie('token').redirect('/login');
}

module.exports = controller;