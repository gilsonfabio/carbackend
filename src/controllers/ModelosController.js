const crypto = require('crypto');
const connection = require('../database/connection');
const nodemailer = require("nodemailer");
require('dotenv/config');

const jwt = require('jsonwebtoken');
const {v4:uuidv4} = require ('uuid') ; 

module.exports = {       
    
    async index (request, response) {
        const modelos = await connection('modelos')
        .join('marcas', 'marId', 'modelos.modMarId')
        .select(['modelos.*','marcas.marDescricao']);
    
        return response.json(modelos);
    },
    
    async create(request, response) {
        console.log(request.body);
        const {modDescricao, modMarId} = request.body;
        const [modId] = await connection('modelos').insert({
            modDescricao,
            modMarId, 
        });
           
        return response.json({modId});
    },

    async dadModelo (request, response) {        
        let id = request.params.modId;
        const modelo = await connection('modelos')
        .where('modId', id)
        .orderBy('modDescricao')
        .select('*');

        return response.json(modelo);
    },

    async updModelo(request, response) {
        let id = request.params.modId;        
        const {modDescricao, modMarId} = request.body;
        await connection('modelos')
        .where('modId', id)
        .update({
            modDescricao,
            modMarId,
        });
           
        return response.status(204).send();
    },

    async modMarcas (request, response) {        
        let id = request.params.marId;
        const modLista = await connection('modelos')
        .where('modMarId', id)
        .join('marcas', 'marId', 'modelos.modMarId')
        .orderBy('modDescricao')
        .select(['modelos.*','marcas.marDescricao']);

        return response.json(modLista);
    },

};
