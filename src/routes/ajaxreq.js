const express = require('express');
const ajaxController = require('../controllers/ajaxController');
const apiController = require('../controllers/apiController');
const Router = express.Router();

Router.get('/get_agency_monthly_assessment_chart', async(req, res)=> {
    ajaxController.agenncyMonthAssessmentChart(req, res)
})


Router.get('/get_agency_monthly_assessment_payment_chart', async(req, res)=> {
    ajaxController.agencyMonthlyPaymentChart(req, res)
})


Router.get('/get_tax_office_paid_assessment', async(req, res)=> {
    ajaxController.monthlyPaidAss(req, res)
})

Router.get('/get_tax_office_unpaid_assessment', async(req, res)=> {
    ajaxController.monthlyUnPaidAss(req, res)
})

Router.get('/get_tax_office_paid_assessment_item', async(req, res)=> {
    ajaxController.paymentByItem(req, res);
})



Router.get('/chart_payment_by_revenue_offices', async(req, res)=> {
    ajaxController.paymentByOffices(req, res);
})

Router.get('/payment_by_consultants', async(req, res)=> {
    ajaxController.paymentByAgency(req, res);
})


Router.get('/get_local_gove', async(req, res)=> {
    ajaxController.getLGA(req, res);
})

Router.get('/get_wards',  ajaxController.getLgaWards)




module.exports = Router