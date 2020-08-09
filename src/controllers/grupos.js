const { getConnection } =  require('../database');
const con = getConnection();

module.exports = {
    getGrupo: async (req,res)=>{
        try {
            const response = await con.query(`SELECT * FROM grupos WHERE id = ${req.params.id}`);
            const grupo = JSON.parse(JSON.stringify(response[0][0]));
            return res.json(grupo);
        } catch (error) {
            console.log(error)
            return res.status(500).json({message:'error'});
        }
    },
    getGrupos: async(req,res)=>{
        try {
            const response = await con.query(`
                SELECT grupos.*,grupo_user.user1_id, grupo_user.user2_id FROM grupos 
                LEFT JOIN grupo_user ON grupo_user.grupo_id = grupos.id
                WHERE tipo = 1 OR (grupo_user.user1_id = ${req.user_id} OR grupo_user.user2_id = ${req.user_id})
                ORDER BY grupos.id asc
            `);
            const grupos = JSON.parse(JSON.stringify(response[0]))
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
            return res.status(200).json(grupos);
        } catch (error) {
            console.log(error)
            return res.status(500).json({message:'error'});
        }
    },
    createGrupo: async(req,res)=>{
        try {
            const resp = await con.query(`
                SELECT grupos.* FROM grupos 
                INNER JOIN grupo_user ON grupo_user.grupo_id = grupos.id 
                WHERE (grupo_user.user1_id = ${req.user_id} AND grupo_user.user2_id = ${req.body.user_2})
                OR (grupo_user.user1_id = ${req.body.user_2} AND grupo_user.user2_id = ${req.user_id})`
            )
            if (resp[0][0]) return res.status(200).json({message:'Sala ya existe', id:resp[0][0].id});
            const newGroup = {
                nombre: 'Grupo privado',
                tipo: 2
            }
            const response = await con.query('INSERT INTO grupos set ?', [newGroup]);
            const newGroupUser = {
                user1_id: req.user_id,
                user2_id: req.body.user_2,
                grupo_id: response[0].insertId
            };
            await con.query('INSERT INTO grupo_user set ?', [newGroupUser]);
            return res.status(200).json({insertId: newGroupUser.grupo_id});
        } catch (error) {
            console.log(error)
            return res.status(500).json({message:'error'});
        }
    }
}