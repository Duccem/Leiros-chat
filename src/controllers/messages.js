const { getConnection } =  require('../database');
const { getsocket } = require('../sockets')
const con = getConnection();

module.exports = {
    getMessages: async (req,res) =>{
        try {
            let grupo = req.query.grupo;
            let response = await con.query(`SELECT messages.*, users.username FROM messages INNER JOIN users ON users.id = user_id WHERE grupo_id = '${grupo}' ORDER BY fecha_at asc`);
            let messages = JSON.parse(JSON.stringify(response[0]));
            return res.json(messages);
        } catch (error) {
            console.log(error);
            return res.json([])
        }
    },
    sendMessage:async (req,res) => { 
        try {
            newMessage = {
                message: req.body.message,
                user_id: req.user_id,
                grupo_id: req.body.grupo_id
            }
            await con.query('INSERT INTO messages set ? ', [newMessage]);
            getsocket().io.emit(`new-message-${newMessage.grupo_id}`);
            return res.json({sended: true});
        } catch (error) {
            console.log(error)
            return res.status(500).json({sended: false});
        }
    },
    deleteMessage: async(req,res)=>{
        try {
            await con.query(`DELETE FROM messages WHERE id = ${req.params.id}`);
            return res.json({deleted: true});
        } catch (error) {
            console.log(error)
            return res.status(500).json({sended: false});
        }
    }
};