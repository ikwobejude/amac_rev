const express = require('express');
const apiController = require('../controllers/apiController');
const { generatePaymentInvoice } = require('../controllers/apiPersistence/apiGenereteMandatePersistence');
const { initialPayment } = require('../config/validation');
const api = express.Router();


api.post('/verifyTin', apiController.apiAuthValidation,  apiController.verifyTaxpayerTin)

api.route('/Initilize_transaction')
.post(apiController.apiAuthValidation, async(req, res) => {
    const bodyData = req.body;
    try {
        const newInvoice = await  apiController.initializePayment({generatePaymentInvoice, initialPayment}, bodyData, req.apiUser);
        res.status(200).json({
            status: "success",
            ...newInvoice
        })
    } catch (error) {
        console.log(error.stack)
        res.status(201).json({
            status: "error",
            error: error.message,
            errorStack: error.stack
        })
    }
})

api.route('/verify_payment')
    .post(async (req, res) => {
        apiController.verifyPayment(req, res);
    })
    .get(async (req, res) => {
        apiController.verifyPayment_get(req, res)
    });

api.get('/documentation', async(req, res) => {
    res.render('documentation')
})

api.get('/get_payment_page', apiController.getpayment)
api.post('/get_payment_page', (req, res) => {
    apiController.postPayment(req, res)
    // console.log("hi")
})

api.get('/paystack', (req, res) => {
    apiController.paystackCallback(req, res)
})


api.verify
module.exports = api;
