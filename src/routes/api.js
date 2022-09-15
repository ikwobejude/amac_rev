const express = require('express');
const apiController = require('../controllers/apiController');
const api = express.Router();


api.post('/verifyTin', async(req, res) => {
    apiController.verifyTaxpayerTin(req, res);
})

api.post('/Initilize_transaction', async(req, res) => {
    apiController.initilizePayment(req, res)
});

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

module.exports = api;
