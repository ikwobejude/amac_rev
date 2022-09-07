const express = require('express');
const agenciesController = require('../controllers/agenciesController');
const settings = express.Router();

settings.route('/agency_type')
.get(async(req, res) => {
    agenciesController.agency_type_get(req, res)
})
.post(async(req, res)=> {
    agenciesController.agency_type_post(req, res)
})

settings.post('/agency_type_delete', async(req, res)=> {
    agenciesController.deleteAgencyType(req, res)
})


module.exports = settings;