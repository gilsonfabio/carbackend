const crypto = require('crypto');
const express = require('express');
const routes = express.Router();
const jwt = require('jsonwebtoken');

const UsersController = require('./controllers/UsersController');
const MarcasController = require('./controllers/MarcasController');
const ModelosController = require('./controllers/ModelosController');

routes.get('/', (request, response) => {
    response.json({
        message: 'Bem-vindo ao servidor Cars!',
    });
});

function verifyJWT(req, res, next){
    //console.log('verificando token...')
    const token = req.headers["x-access-token"];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.SECRET_JWT, (err, userInfo) => {
        if (err) {
           return res.status(403).send({ auth: false, message: 'Token invalid!' });
        }                
        next();            
    });
}

async function verifyRefreshJWT(req, res, next){
    //console.log('verificando refresh token...')
    const refreshTokenJWT = req.headers["x-access-token"];
    if (!refreshTokenJWT) return res.status(401).send({ auth: false, message: 'No refresh token provided.' });
    
    jwt.verify(refreshTokenJWT, process.env.SECRET_JWT_REFRESH, (err, userInfo) => {
        if (err) {
           return res.status(403).send({ auth: false, message: 'Refresh Token invalid!' });
        }
        next();            
    });
}

routes.post('/refreshToken', verifyRefreshJWT, UsersController.refreshToken);

routes.post('/signIn', UsersController.signIn);

routes.get('/users', verifyJWT, UsersController.index);
routes.post('/newuser', verifyJWT, UsersController.create);

routes.put('/solPassword/:email', UsersController.solPassword);
routes.put('/updAdmPassword', UsersController.updAdmPassword);

routes.get('/loginAdm/:email/:password/:modId', UsersController.loginAdm);

routes.get('/dadUsuario/:idUsr', verifyJWT, UsersController.dadUsuario);
routes.put('/updUsuario/:idUsr', verifyJWT, UsersController.updUsuario);
routes.post('/newModUsuario', verifyJWT, UsersController.newModUsuario);

routes.get('/marcas', verifyJWT, MarcasController.index);
routes.post('/newmarca', verifyJWT, MarcasController.create);
routes.get('/dadMarca/:marId', verifyJWT, MarcasController.dadMarca);
routes.put('/updMarca/:marId', verifyJWT, MarcasController.updMarca);

routes.get('/modelos', verifyJWT, ModelosController.index);
routes.post('/newmodelo', verifyJWT, ModelosController.create);
routes.get('/dadModelo/:modId', verifyJWT, ModelosController.dadModelo);
routes.put('/updModelo/:modId', verifyJWT, ModelosController.updModelo);
routes.get('/modMarcas/:marId', verifyJWT, ModelosController.modMarcas);

module.exports = routes;
