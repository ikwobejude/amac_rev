const express = require('express')
const self = express.Router();
const selfssessmentController = require('../controllers/selfssessmentController')


// revenue receipts 
self.get('/dashboard', selfssessmentController.selfAssessDashboard)

self.route('/tcc')
.get(selfssessmentController.applyTCC)
.post()


// revenue invoices
// self.get('/payment_incoices', selfssessmentController.viewPaymentIn)
module.exports = self;