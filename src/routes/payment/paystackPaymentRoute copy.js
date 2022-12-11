const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const db = require('../../db/db')
const _ = require('lodash');
const path = require('path');
const paystacts = express.Router();
// const { Payment, Orders, Ordersproduct, Products } = require('../../models/productModel/productmodel');
const { Users } = require('../../models/usersMosel');
const { Donation } = require('../../models/normalize_model');
const verification = require("../../config/verification");
const { assessments } = require('../../model/assessmentModels');
const { vehicles } = require('../../model/texPayersmodels');
const { Api_Payments } = require('../../model/paymentModel');


const { initializePayment, verifyPayment } = require('../../lib/paystack')(request);


paystacts.post('/paystack/pay', (req, res) => {
    const form = _.pick(req.body, ['amount', 'email', 'full_name']);
    form.metadata = {
        full_name: form.full_name
    }
    form.amount *= 100;
    initializePayment(form, (error, body) => {
        if (error) {
            //handle errors
            console.log(error);
            return;
        }
        response = JSON.parse(body);
        console.log(response);

        if (response.data.authorization_url) {

            const dtime = new Date().toLocaleString();

            let invoicing = verification.InvoiceNumb(10)
            let formData = req.body;
            let ass = {
                assessment_ref : invoicing,
                assessment_date: new Date(),
                tax_payer_type: "ONLINE HAILING",
                tax_payer_rin: req.user.user_code,
                tax_payer_name: req.user.name,
                profile_ref: formData.plate_number,
                tax_year:new Date().getFullYear(),
                assessment_amount: formData.amount,
                service_id: 1768529602,
                batch_number: verification.Batch(20),
                source: "TEST PAYMENT",
                tax_month: new Date().getMonth() + 1,
                assessment_item: formData.payment_type,
                invoice_number: response.data.reference
            }
            let newAssessment = new assessments(ass)
            newAssessment.save().then(() => {
                res.redirect(response.data.authorization_url)
            })
        }

    });
});

paystacts.get('/paystack/callback', async(req, res) => {
    
    const ref = req.query.reference;

     verifyPayment(ref, async(error, body) => {
        if (error) {
            //handle errors appropriately
            console.log(error)
            return res.redirect('/error');
        }
        response = JSON.parse(body);

        const data = _.at(response.data, ['reference', 'amount', 'customer.email', 'metadata.full_name']);

        [reference, amount, email, full_name] = data;
        console.log("this is a return data " + data)
        retData = { references: reference, amount, email, full_name }
        // console.log(newDonor)


        let t = await  db.transaction();
        let ass = await assessments.findOne({where:{invoice_number:newDonor.references}}).then(ass => {

        let apiPay = {
            PaymentLogId: rndNumb(20),
            CustReference: newDonor.references,
            AlternateCustReference: rndNumb(10),
            Amount: retData.amount,
            PaymentMethod: "SMART APPS PAYMENT",
            PaymentReference: rndNumb(10),
            PaymentDate: new Date(),
            InstitutionId: 282,
            BankCode: 282,
            service_id: 2344170253,
            CustomerName: retData.full_name
        }

        try {
            await vehicles.update({paid:1}, {where: {vechicle_reg_no: ass.profile_ref}}, {new:true})
            await ass.update({settlement_status:1, assessment_amount_paid:retData.amount, settlement_date:new Date()}, {transaction: t});
            await Api_Payments.create(apiPay, {transaction: t});
            await t.commit()
            // res.status(200).json({id:value.invoice}); 
            res.redirect('/receipts/summary_receipt?invoice_numbe='+newDonor.references);
            req.flash('info', 'Your Payment Was Successful')   
        } catch (error) {
            await t.rollback()
            let err = handleError(error);
            res.status(201).json({err: err.message })
        }
       

    })
});


try {
    let {error, value} = paymentData.validate(req.body)
    if(error) {
        res.status(201).json({err: error.message})
    } else {
        let payload = {
            name: value.name, 
            card: value.card,
            card_month: value.card_month,
            vard_year: value.vard_year,
            cvv: value.cvv,
            invoice: value.invoice,
            Amount: value.amount,
        }
        let apiPay = {
            PaymentLogId: rndNumb(20),
            CustReference: value.invoice,
            AlternateCustReference: rndNumb(10),
            Amount: value.amount,
            PaymentMethod: "SMART APPS PAYMENT",
            PaymentReference: rndNumb(10),
            PaymentDate: new Date(),
            InstitutionId: 282,
            BankCode: 282,
            service_id: 2344170253,
            CustomerName: req.user.user_code
        }
        let t = await  db.transaction();
        let ass = await assessments.findOne({where:{invoice_number:value.invoice}})
        try {
            await vehicles.update({paid:1}, {where: {vechicle_reg_no: ass.profile_ref}}, {new:true})
            await ass.update({settlement_status:1, assessment_amount_paid:value.amount, settlement_date:new Date()}, {transaction: t});
            await Api_Payments.create(apiPay, {transaction: t});
            await t.commit()
            res.status(200).json({id:value.invoice});    
        } catch (error) {
            await t.rollback()
            let err = handleError(error);
            res.status(201).json({err: err.message })
        }
        
    }
} catch (error) {
    let err = handleError(error);
    res.status(201).json({err: err.message })
}
paystacts.get('payment_notification', (req, res) => {

})
paystacts.get('/receipt/:id/:reference', (req, res) => {
    const id = req.params.id;
    const reference = req.params.reference;
    Ordersproduct.findAll({ where: { paymentRef: reference } }).then(result => {
        Payment.findOne({ where: { references: reference } }).then(details => {
            res.render('./home/payment/payment_invoice', {
                result: result,
                details: details
            })
        })
    })
})

paystacts.get('/error', (req, res) => {
    res.render('', {

    })
})


module.exports = paystacts;