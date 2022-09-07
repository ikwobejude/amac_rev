const express = require('express');
const cbsController = require('../controllers/cbsController');
const cbs = express.Router();

cbs.get('/dashboard', async(req, res) => {
    cbsController.adminDashboard(req, res)
})


module.exports = cbs