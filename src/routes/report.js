const express = require('express')
const report = express.Router();
const receiptController = require('../controllers/receptController');
const reportController = require('../controllers/reportController');


// revenue receipts 
report.get('/payment_transaction', async(req, res) => {
    reportController.transactionReport(req, res)
})


// revenue invoices
report.get('/transaction_by_items', async(req, res) => {
   
        reportController.transactionReportItem(req, res);
    
   
})

report.get('/transaction_by_bnk', async(req, res) => {
    res.send("comming soon")
})


report.get('/view_transactions', async(req, res)=> {
    reportController.individualTransactions(req, res)
})



module.exports = report;