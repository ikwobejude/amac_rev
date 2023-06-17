const { Sequelize, QueryTypes } = require('sequelize');
const Op = Sequelize.Op;
const db = require('../db/db')
const { _countries, states, local_government_area, wards, _street } = require("../model/texPayersmodels");

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
    
    // wards
    getWards: async() => {
        const lga = await local_government_area.findAll({where : {state_id: 15}});
        const data = await db.query(`SELECT * FROM wards INNER JOIN local_goverment_area ON wards.lga_id = local_goverment_area.id_lga WHERE local_goverment_area.state_id = 15`, {type: QueryTypes.SELECT});
        return {lga, data};
    },

    createWard: async(data, metaData) => {
        try {
            const ward = await wards.findOne({where: {ward: data.ward, lga_id: data.lga_id }});
            if(ward){
                throw Error('Wards already exist!')
            } else {
                const lga = await local_government_area.findOne({where:{id_lga: data.lga_id }, raw:true});
                const newWard = await wards.create({
                    ward: data.ward,
                    lga: lga.lga,
                    created_by: metaData.username,
                    lga_id: data.lga_id,
                    service_id:  metaData.service_id,
                })

                return newWard;
            }
        } catch (error) {
            throw Error(error.message)
        }
    },

    editWard: async(data) => {
       try {
            const lga = await local_government_area.findOne({where:{id_lga:  data.lga_id }, raw:true});
            await wards.update({ 
                ward: data.ward,
                lga: lga.lga,
                lga_id: data.lga_id
            }, {where : {ward_id: data.id}}, {new:true});

            return 1
       } catch (error) {
        throw Error(error.message)
       }
    },
    deleteWard: async(id) => {
        await wards.destroy({where: {ward_id: id}});
        return "deleted!";
    },
    // end of ward crud operation

    // street 
    getStreet: async() => {
        const lga = await local_government_area.findAll({where : {state_id: 15}});
        const data = await db.query(`SELECT _streets.street, wards.ward FROM _streets INNER JOIN wards ON _streets.ward_id = wards.ward_id`, {type: QueryTypes.SELECT});
        return {lga, data};
    },


    createNewStreet: async(data, metaData) => {
        console.log(data, metaData)
        try {
            const wrd = await _street.findOne({where: {street:data.street }})
            console.log(wrd)
            if(wrd){
                throw Error('Wards already exist!')
            } else {
               const street =  await _street.create({
                    street: data.street,
                    ward_id: data.ward,
                    service_id:  metaData.service_id,
                })

                return street;
            }
        } catch (error) {
            throw Error(error.message)
        }
    },
}