const {server, app} = require('./app');

server.listen(app.get('port'),()=>{
    console.log('[server] on port ', app.get('port'));
});