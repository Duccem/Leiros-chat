const { getConnection } =  require('../database');
const con = getConnection();
controller  = {};
controller.sendMessage = async (req,res) => { 
    try {
        newMessage = {
            message: req.body.message,
            user_id: req.user_id,
            grupo_id: req.body.grupo_id
        }
        await con.query('INSERT INTO messages ? ', [newMessage]);
        return res.json({sended: true});
    } catch (error) {
        console.log(error)
        return res.json({sended: false});
    }
}

controller.getMessages = async (req,res) =>{
    try {
        let grupo = req.params.grupo;
        let response = await con.query(`SELECT * FROM messsages WHERE user_id = '${req.user_id}' AND grupo_id ${grupo} ORDER BY fecha_at ORDER desc`);
        let messages = JSON.parse(response[0]);
        return res.json(messages);
    } catch (error) {
        console.log(error);
        return res.json([])
    }
}