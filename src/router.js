const homeController = require('./controllers/home');
const usersController = require('./controllers/user');
const messagesController = require('./controllers/messages');
const gruposController = require('./controllers/grupos');
const { verify, logedin } = require('./helpers/verify');
const { Router } = require('express')

const routes = Router();

module.exports = app => {
    routes.get('/',verify, homeController.index);
    routes.get('/login', logedin, homeController.login);
    routes.get('/signup', homeController.signup);
    routes.get('/logout', verify, homeController.logout);
    routes.get('/messages', verify, messagesController.getMessages);
    routes.get('/grupos/:id', verify, gruposController.getGrupo);
    routes.get('/grupos', verify, gruposController.getGrupos);
    routes.post('/grupos', verify, gruposController.createGrupo);
    routes.post('/messages', verify, messagesController.sendMessage);
    routes.post('/users/login', usersController.login);
    routes.post('/users/signup', usersController.signup);
    routes.delete('/messages/:id', verify, messagesController.deleteMessage);
    app.use(routes);
}