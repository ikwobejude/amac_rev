const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('../db/db')
const jwt = require('jsonwebtoken');
const { paymentData } = require('../config/validation');
const { assessments, assessment_item_invoices } = require('../model/assessmentModels');
const { Api_Payments } = require('../model/paymentModel');
require('dotenv').config();

const masAge =  60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRECT, {
        expiresIn: masAge
    })
}



function rndNumb(len) {
    len = len || 100;
    var nuc = "0123456789";
    var i = 0;
    var n = 0;
    s = '22';
    while (i <= len - 1) {
        n = Math.floor(Math.random() * 4);
        s += nuc[n];
        i++;
    }
    return s;
}


module.exports.getPaymentpage = async(req, res) => {
    let token = req.query.idf
    if (token) {
        jwt.verify(token, process.env.JWT_SECRECT, async(err, decodedToken) => {
            if (err) {
                console.log(err.message)
                res.redirect('/login')
            } else {
                console.log(decodedToken)
               let assessment = await findAssessment(decodedToken.id);
               if(assessment) {
                   res.render('./payment_text/index', {
                    assessment
                   })
               }            
            }
        })
    } else {
        console.log("this payment is invalid")
    }
   
}

module.exports.Pay = async(req, res) => {
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
                service_id: 2344170253
            }
            let t = await  db.transaction();
            try {

                await assessments.update({settlement_status:1, assessment_amount_paid:value.amount, settlement_date:new Date()}, {where:{invoice_number:value.invoice}}, {transaction: t});
                await assessment_item_invoices.update({paid:1}, {where:{invoice_number:value.invoice}},  {transaction: t});
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
}


module.exports.initiazing = async(req, res) => {
    let id = req.query.invoice_number
    
    res.render('./payment_text/loading', {
        id
    })
    
}

module.exports.initiazingPost = async(req, res) => {
    try {
        let id = req.query.invoice_number;
        const token = createToken(id);
        // let hashInvoice = await _Encrypt(id);
        res.status(200).json({id:token})
    } catch (error) {
        res.status(201).json({err:error.message})
    }
}

async function findAssessment(id) {
    let assessment = await assessments.findOne({where:{invoice_number: id}});
    if(assessment){
        return assessment;
    }
    throw Error('INVOICE NUMBER NOT FOUND')
}

async function _Encrypt(text) {
    return await bcrypt.hash(text, saltRounds);
}

// error handler 
const handleError = (err) => {

    return err;
}