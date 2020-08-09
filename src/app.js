const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const http = require('http');
const app = express();

const routes = require('./router');
const { init } = require('./sockets')

require('./database')
app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname,'./views'));
app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    partialsDir:path.join(app.get('views'),'partials'),
    layoutsDir:path.join(app.get('views'),'layouts'),
    extname:'.hbs',
    helpers: require('./lib')
}));
app.set('view engine', '.hbs');
app.use('/public',express.static(path.join(__dirname,'./public')));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended:false}));


routes(app);

const server = http.createServer(app);
init(server);
module.exports = {server, app};