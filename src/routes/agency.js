const express = require('express');
const agenciesController = require('../controllers/agenciesController');
const agency = express.Router();


agency.get('/dashboard', async(req, res)=> {
    agenciesController.dashboard(req, res)
})
agency.route('/agencies')
    .get(async (req, res) => {
        agenciesController.createAgents_get(req, res)
    })
    .post(async (req, res) => {
        agenciesController.createAgents_post(req, res)
    })


agency.get('/report', async(req, res)=> {
    agenciesController.agentReports(req, res)
})
module.exports = agency;