const express = require('express');
const officeController = require('../controllers/officeController');
const office = express.Router();

office.route('/dashboard')
.get(async(req, res)=> {
    officeController.officeDashboard(req, res);
})

module.exports = office;