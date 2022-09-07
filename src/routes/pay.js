const express = require('express');
const testPaymentController = require('../controllers/testPaymentController');
const pay = express.Router();


// revenue receipts 

pay.route('/test_payment')
.get(async(req, res) => {
    testPaymentController.getPaymentpage(req, res);
})
.post(async(req, res) => {
    testPaymentController.Pay(req, res);
})

pay.route('/inilizing')
.get(async(req, res) => {
   testPaymentController.initiazing(req, res)

})
.post(async(req, res) => {
    testPaymentController.initiazingPost(req, res)
})




module.exports = pay;