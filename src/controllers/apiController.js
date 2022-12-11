const request = require('request');

const _ = require('lodash');
const path = require('path')

const { Sequelize, QueryTypes, where } = require('sequelize');
const Op = Sequelize.Op;
const db = require('../db/db')
const { initializePayment, verifyPayment1 } = require('../lib/paystack')(request);

const { TaxTin, valideteUsersignup, initialPayment, verifyPaymentInvo } = require("../config/validation");
const { assessments } = require("../model/assessmentModels");
const { Api_Payments } = require("../model/paymentModel");
const { tax_payers } = require("../model/texPayersmodels");



// error handler 
const handleError = (err) => {
    return err;
}

module.exports.verifyTaxpayerTin = async (req, res) => {
    try {
        const { error, value } = TaxTin.validate(req.body);
        if (error) {
            res.status(201).json({code: 201, msg: error.message })
        }
        const taxPayerTin = {
            usertin: value.tax_payer_tin
        }

        let Vtin = await findValidTin(taxPayerTin.usertin)
        res.status(200).json({code: 200, msg: "Unique tin found", Vtin })

    } catch (error) {
        let err = handleError(error)
        res.status(201).json({code: 201, "err": err.message })
    }
}


module.exports.initilizePayment = async (req, res) => {
    try {
        const { error, value } = initialPayment.validate(req.body);
        if (error) {
            res.status(201).json({code: 201, msg: error.message })
        } else {
            let Vtin = await findValidTin(value.tin);
            if (Vtin) {
                let payload = {
                    tin: value.tin,
                    assessmenrReference: value.paymentReference,
                    item: value.paymentItem,
                    amount: value.amount,
                    bill_reference: await paymenID(),
                    callBackUrl: value.callBackUrl,

                }

                res.status(200).json({code: 200, msg: "Initialized", payload })
            }
        }
    } catch (error) {
        let err = handleError(error)
        res.status(201).json({code: 201, msg: err.mesaage })
    }
}



module.exports.verifyPayment_get = function(req, res) {
    res.render('./api/api_verify_payment')
}


module.exports.verifyPayment = async (req, res) => {
    try {
        const { error, value } = verifyPaymentInvo.validate(req.body);
        if (error) {
            res.status(201).json({ err: error.message })
        } else {
          let verified = await verifyPayment(value.invoice) ;
          if(verified){
            res.status(200).json(verified);
          }
        }
    } catch (error) {
        let err = handleError(error)
        res.status(201).json({ "err": err.message })
    }
    
}


// paystacts.route('/paystack/pay1')
module.exports.getpayment = async(req, res) =>{
    let invoice = req.query.invoice_number;
    let assess = await assessments.findOne({where: {invoice_number: invoice}});
    let taxp = await tax_payers.findOne({where:{taxpayer_rin : assess.tax_payer_rin}})
    res.render('./receipt/payment', {
        assess, taxp
    })
}


// payst.post('/paystack/pay', (req, res) => {
    module.exports.postPayment = (req, res) =>{
    try {
        const form = _.pick(req.body, ['amount', 'email', 'full_name']);
        console.log(form)
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
                assessments.findOne({ where: { invoice_number: req.body.invoice_number } }).then(ass => {
                    db.query(`UPDATE assessment_item_invoices SET profile_ref ='${response.data.reference}' WHERE invoice_number='${req.body.invoice_number}'`)
                    ass.update({profile_ref: response.data.reference}, {new:true})
            
                    res.redirect(response.data.authorization_url)
                })
            }

        }); 
    } catch (error) {
       console.log(error) 
    }
   
};


module.exports.paystackCallback = (req, res)=> {
    const ref = req.query.reference;

    verifyPayment1(ref, async (error, body) => {
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
        console.log(newDonor)


        // let t = await  db.transaction();
        assessments.findOne({ where: { profile_ref: retData.references } }).then(ass => {
            var oneYearFromNow = new Date();
            let apiPay = {
                PaymentLogId:ass.assessment_ref,
                CustReference: ass.invoice_number,
                AlternateCustReference: ass.assessment_ref,
                Amount: ass.assessment_amount,
                PaymentMethod: "SMART APPS PAYMENT",
                PaymentReference: retData.references,
                PaymentDate: oneYearFromNow,
                InstitutionId: 282,
                BankCode: 282,
                service_id: 2344170253,
                CustomerName: retData.full_name
            }

            let ass1 = {
                assessment_amount_paid :  ass.assessment_amount,
                settlement_status : 1,
                settlement_date : oneYearFromNow,
                settlement_method : 'PAYSTACK'
            }
           
            let expiry = oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
            ass.update(ass1, {new:true});
            Api_Payments.create(apiPay);
            // await t.commit()
            // res.status(200).json({id:value.invoice}); 
            res.redirect('/receipts/summary_receipt?invoice_number=' + ass.invoice_number);
            // req.flash('info', 'Your Payment Was Successful')

        })

    })
}



async function verifyPayment(bref) {
    const payment = await Api_Payments.findOne({ where: { CustReference: bref } });
    if (payment) {
        return payment;
    }
    throw Error('PAYMENT NOT FOUND')
}




async function findValidTin(tin) {
    const taxPayer = await tax_payers.findOne({ where: { taxpayer_rin: tin } })
    if (taxPayer) {
        return taxPayer;
    }
    throw Error('TIN NOT FOUND')
}

async function paymenID() {
    return "N-AMAC" + Math.floor(Math.random() * Date.now())
}

