const homeController = require('./controllers/home');
const usersController = require('./controllers/user');
const { Router } = require('express')

const routes = Router();

module.exports = app => {
    routes.get('/', homeController.index);
    routes.get('/login', homeController.login);
    routes.get('/signup', homeController.signup);
    routes.post('/users/login', usersController.login);
    routes.post('/users/signup', usersController.signup);
    app.use(routes);
}