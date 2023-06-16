const { Sequelize, QueryTypes } = require('sequelize');
const Op = Sequelize.Op;
const db = require('../db/db')
const { _countries, states, local_government_area } = require("../model/texPayersmodels");

module.exports = {
    getCountry: async() => {
        const country = await _countries.findAll({raw:true});
        return country
    },
    
    // state datas
    getState: async() => {
        const country = await _countries.findAll();
        const data = await db.query(`SELECT * FROM states INNER JOIN countries ON states.country = countries.country_id`, {type: QueryTypes.SELECT});
        return {country, data}
    },
    
    getLga: async() => {
        const state = await states.findAll({where : {country: 131}});
        const data = await db.query(`SELECT * FROM local_goverment_area INNER JOIN states ON local_goverment_area.state_id = states.id WHERE states.id = 15`, {type: QueryTypes.SELECT});
        return {state, data};
    },
    
    
    getWards: async() => {
        const lga = await local_government_area.findAll({where : {state_id: 15}});
        const data = await db.query(`SELECT * FROM wards INNER JOIN local_goverment_area ON wards.lga_id = local_goverment_area.id_lga WHERE local_goverment_area.state_id = 15`, {type: QueryTypes.SELECT});
        return {lga, data};
    }
}