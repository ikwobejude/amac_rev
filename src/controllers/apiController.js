const request = require('request');
const jwt = require('jsonwebtoken');

const _ = require('lodash');
const path = require('path')

const { Sequelize, QueryTypes, where } = require('sequelize');
const Op = Sequelize.Op;
const db = require('../db/db')
const { initializePayment, verifyPayment1 } = require('../lib/paystack')(request);

const { TaxTin, valideteUsersignup, verifyPaymentInvo } = require("../config/validation");
const { assessments, invoice_number_count } = require("../model/assessmentModels");
const { Api_Payments } = require("../model/paymentModel");
const { tax_payers } = require("../model/texPayersmodels");
const userModel = require('../model/userModel');



// error handler 
const handleError = (err) => {
    return err;
}

module.exports = {
    apiAuthValidation: async(req, res, next)=> {
        try {
        //     let token = req.headers
        //     console.log(req.headers.authorization)
            const token = req.headers.authorization.split(" ")[1];
            // console.log(token);
            if (token) {
                jwt.verify(token, process.env.JWT_SECRECT, async(err, decodedToken) => {
                    if (err) {
                        res.status(401).json({
                            status: "error",
                            message: err.message
                        })
                    } else {
                        let user = await userModel.Users.findOne({
                            attributes:["id", 'group_id', "name", "email", "user_phone", "service_id", "service_code"],
                            where:{id: decodedToken.id}
                        })
                        req.apiUser = user;
                        next()
                    }   
                })
            } else {
                res.status(401).json({
                    status: "error",
                    message: "authorization token not found!"
                })
            }  
    
    
        } catch (error) {
            // console.log(error.stack)
            if(error.message == "Cannot read properties of undefined (reading 'split')"){
                res.status(401).json({
                    status: "error",
                    message: "Unknown error",
                    data: "Invalid authorization code"
                })
            } else {
                res.status(401).json({
                    status: "error",
                    message: "Unknown error",
                    data: error.message
                })
            }
            
        }
       
    },

    verifyTaxpayerTin: async (req, res) => {
        try {
            // res.json(req.body)
            const { error, value } = TaxTin.validate(req.body);
            if (error) {
                res.status(201).json({
                    status: "error", 
                    msg: error.message 
                })
            }
            const taxPayerTin = {
                usertin: value.tax_payer_tin
            }
    
            let data = await findValidTin(taxPayerTin.usertin)
            res.status(200).json({
                status: "success", 
                msg: "Unique tin found", 
                data 
            })
    
        } catch (error) {
            let err = handleError(error)
            res.status(201).json({
                status: "error", 
                "err": err.message 
            })
        }
    },

    initializePayment: async (
        {generatePaymentInvoice, initialPayment}, payload, metadata ) => {
        try {
            const { error, value } = initialPayment.validate(payload);
            if (error) {
                console.log(error)
               throw new Error(error.message.split('"').join(""));
            } else {
                const vTin = await findValidTin(value.tin);
                const invoiceNumber = await paymentID();
                const data = await generatePaymentInvoice(vTin, value, invoiceNumber, metadata)
                if (vTin) {
                    return {
                        code: 200, 
                        msg: "Initialized", 
                        data 
                    }
                }
            }
        } catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    },
    verifyPayment_get: function(req, res) {
        res.render('./api/api_verify_payment')
    },

    verifyPayment: async (req, res) => {
        try {
            const { error, value } = verifyPaymentInvo.validate(req.body);
            if (error) {
                res.status(201).json({ err: error.message })
            } else {
              let verified = await verifyPaymentInvoice(value.invoice) ;
              if(verified){
                res.status(200).json(verified);
              }
            }
        } catch (error) {
            console.log(error)
            let err = handleError(error)
            res.status(201).json({ "err": err.message })
        }
        
    },

    getpayment: async(req, res) =>{
        let invoice = req.query.invoice_number;
        let assess = await assessments.findOne({where: {invoice_number: invoice}, raw:true});
        let taxp = await tax_payers.findOne({where:{taxpayer_rin : assess.tax_payer_rin}, raw:true})
        res.render('./receipt/payment', {
            assess, taxp
        })
    },

    postPayment: (req, res) =>{
        try {
            const form = _.pick(req.body, ['amount', 'email', 'full_name']);
            // console.log(form)
            form.metadata = {
                full_name: form.full_name
            }
            form.amount *= 100;
            initializePayment(form, (error, body) => {
                if (error) {
                    //handle errors
                    console.log(error);
                    // return;
                    res.status(200).json(error)
                } else {
                    response = JSON.parse(body);
                    console.log(response);
                    if(response.status == false){
                        res.status(200).json(response)
                    } else {
                        if (response.data.authorization_url) {
                            assessments.findOne({ where: { invoice_number: req.body.invoice_number } }).then(ass => {
                                db.query(`UPDATE assessment_item_invoices SET profile_ref ='${response.data.reference}' WHERE invoice_number='${req.body.invoice_number}'`)
                                ass.update({profile_ref: response.data.reference}, {new:true})
                        
                                res.status(200).json({
                                    status: true,
                                    redirectUrl: response.data.authorization_url
                                })
                            })
                        }
                    }
                    
        
                    
                }
                
    
            }); 
        } catch (error) {
           console.log(error) 
        }
       
    },

    paystackCallback: (req, res)=> {
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
            // console.log(newDonor)
    
    
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
                db.query(`UPDATE assessments SET assessment_amount_paid ='${ass.assessment_amount}', settlement_status=1, settlement_date='${new Date()}', settlement_method='PAYSTACK' WHERE invoice_number='${ass.invoice_number}'`)
                db.query(`UPDATE assessment_item_invoices SET locked =1, paid=1 WHERE invoice_number='${ass.invoice_number}'`)
                Api_Payments.create(apiPay);
                res.redirect('/receipts/summary_receipt?invoice_number=' + ass.invoice_number);
    
            })
    
        })
    },

   
    // validate taxpayer tin
     findValidTin: async function(tin) {
        const taxPayer = await tax_payers.findOne({ attributes: {exclude: ['passwordr']}, where: { taxpayer_rin: tin }, raw:true })
        if (taxPayer) {
            return taxPayer;
        }
        throw Error('TIN NOT FOUND')
    },

    // get payment invoice number
     paymentID: async function() {
        const invoiceNumber = await invoice_number_count.findOne({raw:true});
    
        await invoice_number_count.update({invoice_number: invoiceNumber.invoice_number + 1 }, 
            {where: 
            {invoice_number: invoiceNumber.invoice_number},
          },
          {new:true}
        )
        
        return "N-AMAC"+invoiceNumber.invoice_number;
    }
}


 async function verifyPaymentInvoice (bref) {
    const payment = await Api_Payments.findOne({ where: { CustReference: bref } });
    if (payment) {
        return payment;
    }
    throw Error('PAYMENT NOT FOUND')
};


