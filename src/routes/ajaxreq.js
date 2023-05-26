const express = require('express');
const ajaxController = require('../controllers/ajaxController');
const apiController = require('../controllers/apiController');
const ajaxreq = express.Router();

ajaxreq.get('/get_agency_monthly_assessment_chart', async(req, res)=> {
    ajaxController.agenncyMonthAssessmentChart(req, res)
})


ajaxreq.get('/get_agency_monthly_assessment_payment_chart', async(req, res)=> {
    ajaxController.agencyMonthlyPaymentChart(req, res)
})


ajaxreq.get('/get_tax_office_paid_assessment', async(req, res)=> {
    ajaxController.monthlyPaidAss(req, res)
})

ajaxreq.get('/get_tax_office_unpaid_assessment', async(req, res)=> {
    ajaxController.monthlyUnPaidAss(req, res)
})

ajaxreq.get('/get_tax_office_paid_assessment_item', async(req, res)=> {
    ajaxController.paymentByItem(req, res);
})



ajaxreq.get('/chart_payment_by_revenue_offices', async(req, res)=> {
    ajaxController.paymentByOffices(req, res);
})

ajaxreq.get('/payment_by_consultants', async(req, res)=> {
    ajaxController.paymentByAgency(req, res);
})


ajaxreq.get('/get_local_gove', async(req, res)=> {
    ajaxController.getLGA(req, res);
})




module.exports = ajaxreq