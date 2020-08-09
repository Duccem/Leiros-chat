const { getConnection } =  require('../database');
controller = {};
const con = getConnection()
controller.index = async(req,res) => {
    const [response, resUser, resUsers] = await Promise.all([
        con.query(`
            SELECT grupos.*,grupo_user.user1_id, grupo_user.user2_id FROM grupos 
            LEFT JOIN grupo_user ON grupo_user.grupo_id = grupos.id
            WHERE tipo = 1 OR (grupo_user.user1_id = ${req.user_id} OR grupo_user.user2_id = ${req.user_id})
            ORDER BY grupos.id asc
        `), 
        con.query(`SELECT * FROM users WHERE  id = ${req.user_id}`),
        con.query(`SELECT * FROM users WHERE  id <> ${req.user_id}`)
    ])
    const grupos = JSON.parse(JSON.stringify(response[0]));
    const user = JSON.parse(JSON.stringify(resUser[0][0]));
    const users = JSON.parse(JSON.stringify(resUsers[0]));
    const promisesUsers = []
    grupos.forEach(element => {
        if(element.user1_id && element.user2_id){
            let promise;
            if(element.user1_id == req.user_id)
                promise = con.query(`SELECT username FROM users WHERE id = ${element.user2_id}`)
            else if(element.user2_id == req.user_id)
                promise = con.query(`SELECT username FROM users WHERE id = ${element.user1_id}`)
            promisesUsers.push(promise);
        }
    });
    let responses = await Promise.all(promisesUsers);
    let index = 0;
    grupos.forEach((element, indice) =>{
        if(element.tipo == 2){
            grupos[indice].username = responses[index][0][0].username
            index++;
        }
        
    })
    const model = {};
    model.grupos = grupos;
    model.user_id = req.user_id;
    model.user = user;
    model.users = users;
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