const crypto = require('crypto');
const connection = require('../database/connection');
const nodemailer = require("nodemailer");
require('dotenv/config');

const jwt = require('jsonwebtoken');
const {v4:uuidv4} = require ('uuid') ; 

module.exports = {       
    
    async index (request, response) {
        const marcas = await connection('marcas')
        .select('marId', 'marDescricao');
    
        return response.json(marcas);
    },
    
    async create(request, response) {
        console.log(request.body);
        const {marDescricao} = request.body;
        const [marId] = await connection('marcas').insert({
            marDescricao, 
        });
           
        return response.json({marId});
    },

    async dadMarca (request, response) {        
        let id = request.params.marId;
        const marca = await connection('marcas')
        .where('marId', id)
        .orderBy('marDescricao')
        .select('*');

        return response.json(marca);
    },

    async updMarca(request, response) {
        let id = request.params.marId;        
        const {marDescricao} = request.body;

        await connection('marcas')
        .where('marId', id)
        .update({
            marDescricao,
        });
           
        return response.status(204).send();
    },

};
