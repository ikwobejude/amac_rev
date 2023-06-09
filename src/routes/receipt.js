const express = require('express')
const receipt = express.Router();
const receiptController = require('../controllers/receptController')


// revenue receipts 
receipt.get('/revenue_invoices', receiptController.viewRevenueReceipt)


// revenue invoices
receipt.get('/payment_incoices', receiptController.viewPaymentIn)


receipt.get('/generate/view_mandate_receipts', receiptController.success)

receipt.get('/view_all_items', async(req, res) => {
    receiptController.allReceipts(req, res);
})


receipt.get('/summary_receipt',  receiptController.sumarryReceipt)



module.exports = receipt;