const express = require('express')
const receipt = express.Router();
const receiptController = require('../controllers/receptController')


// revenue receipts 
receipt.get('/revenue_invoices', async(req, res) => {
    receiptController.viewRevenueReceipt(req, res);
})


// revenue invoices
receipt.get('/payment_incoices', async(req, res) => {
    receiptController.viewPaymentIn(req, res);
})


receipt.get('/generate/view_mandate_receipts', async(req, res) => {
    receiptController.success(req, res);
})

receipt.get('/view_all_items', async(req, res) => {
    receiptController.allReceipts(req, res);
})


receipt.get('/summary_receipt', async(req, res) => {
    receiptController.sumarryReceipt(req, res);
})



module.exports = receipt;