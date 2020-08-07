controller  = {};
controller.sendMessage = async (req,res) => { 
    newMessage = {
        message: req.body.message,
        user_id: req.user_id,
        grupo_id: req.body.grupo_id
    }
}