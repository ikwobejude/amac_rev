const express = require('express');
const genMandate = require('../controllers/mandateController');
const mandate = express.Router();


mandate.route('/assessment/invoice')
    .get(async (req, res) => {
        res.render('./admin/mandate/generate_mandate')
    })
    .post(genMandate.getTapayersDetails)

mandate.route('/generte_invoice')
    .get(genMandate.generateInvoice_get)
    .post(genMandate.generateInvoice_post);

mandate.route('/cancel_or_finish_transaction')
.post(genMandate.deleteAssessmnt)








module.exports = mandate;

