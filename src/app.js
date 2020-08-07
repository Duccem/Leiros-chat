const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();

const routes = require('./router');

require('./database')
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname,'./views'));
app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    partialsDir:path.join(app.get('views'),'partials'),
    layoutsDir:path.join(app.get('views'),'layouts'),
    extname:'.hbs'
}));
app.set('view engine', '.hbs');


app.use('/public',express.static(path.join(__dirname,'./public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

routes(app);

module.exports = app;