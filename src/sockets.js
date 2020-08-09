const socket = require("socket.io");
let con = {};

function init(server){
    con.io = socket(server);
}
function getsocket(){
    return con;
}

module.exports = {
    init, getsocket
}