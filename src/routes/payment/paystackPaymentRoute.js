const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const db = require('../../db/db')
const _ = require('lodash');
const path = require('path');
const payst = express.Router();
// const { Payment, Orders, Ordersproduct, Products } = require('../../models/productModel/productmodel');
// const { Users } = require('../../models/usersMosel');
// const { Donation } = require('../../models/normalize_model');
// const verification = require("../../config/verification");
const { assessments, assessment_item_invoices } = require('../../model/assessmentModels');
const { vehicles, tax_payers } = require('../../model/texPayersmodels');
const { Api_Payments } = require('../../model/paymentModel');


const { initializePayment, verifyPayment } = require('../../lib/paystack')(request);



payst.post('/paystack/pay', (req, res) => {
    try {
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
                assessments.findOne({ where: { invoice_number: form.invoice_number } }).then(ass => {
                    db.query(`UPDATE assessment_item_invoice SET profile_ref ='${response.data.reference}' WHERE invoice_number='${form.invoice_numbe}'`)
                    ass.update({profile_ref: response.data.reference}, {new:true})
            
                    res.redirect(response.data.authorization_url)
                })
            }

        }); 
    } catch (error) {
        
    }
   
});

payst.get('/paystack/callback', async (req, res) => {

    const ref = req.query.reference;

    verifyPayment(ref, async (error, body) => {
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


        // let t = await  db.transaction();
        assessments.findOne({ where: { invoice_number: retData.references } }).then(ass => {
            var oneYearFromNow = new Date();
            let apiPay = {
                PaymentLogId:ass.assessment_ref,
                CustReference: retData.references,
                AlternateCustReference: ass.assessment_ref,
                Amount: ass.assessment_amount,
                PaymentMethod: "SMART APPS PAYMENT",
                PaymentReference: ass.assessment_ref,
                PaymentDate: oneYearFromNow,
                InstitutionId: 282,
                BankCode: 282,
                service_id: 2344170253,
                CustomerName: retData.full_name
            }
           
            let expiry = oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
            vehicles.update({status:3, paid: 1, expiry_date:expiry, description:retData.references}, { where: { vechicle_reg_no: ass.profile_ref } }, { new: true })
            ass.update({ settlement_status: 1, assessment_amount_paid: ass.assessment_amount, settlement_date: new Date() });
            Api_Payments.create(apiPay);
            // await t.commit()
            // res.status(200).json({id:value.invoice}); 
            res.redirect('/invoice?invoice=' + retData.references);
            req.flash('info', 'Your Payment Was Successful')

        })

    })
});


// try {
//     let { error, value } = paymentData.validate(req.body)
//     if (error) {
//         res.status(201).json({ err: error.message })
//     } else {
//         let payload = {
//             name: value.name,
//             card: value.card,
//             card_month: value.card_month,
//             vard_year: value.vard_year,
//             cvv: value.cvv,
//             invoice: value.invoice,
//             Amount: value.amount,
//         }
//         let apiPay = {
//             PaymentLogId: rndNumb(20),
//             CustReference: value.invoice,
//             AlternateCustReference: rndNumb(10),
//             Amount: value.amount,
//             PaymentMethod: "SMART APPS PAYMENT",
//             PaymentReference: rndNumb(10),
//             PaymentDate: new Date(),
//             InstitutionId: 282,
//             BankCode: 282,
//             service_id: 2344170253,
//             CustomerName: req.user.user_code
//         }
//         let t = await db.transaction();
//         let ass = await assessments.findOne({ where: { invoice_number: value.invoice } })
//         try {
//             await vehicles.update({ paid: 1 }, { where: { vechicle_reg_no: ass.profile_ref } }, { new: true })
//             await ass.update({ settlement_status: 1, assessment_amount_paid: value.amount, settlement_date: new Date() }, { transaction: t });
//             await Api_Payments.create(apiPay, { transaction: t });
//             await t.commit()
//             res.status(200).json({ id: value.invoice });
//         } catch (error) {
//             await t.rollback()
//             let err = handleError(error);
//             res.status(201).json({ err: err.message })
//         }

//     }
// } catch (error) {
//     let err = handleError(error);
//     res.status(201).json({ err: err.message })
// }
payst.get('payment_notification', (req, res) => {

})
payst.get('/receipt/:id/:reference', (req, res) => {
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

payst.get('/error', (req, res) => {
    res.render('', {

    })
})


module.exports = payst;