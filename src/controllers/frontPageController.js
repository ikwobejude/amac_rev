const db = require('../db/db')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { createTinAndAccount } = require("../config/validation")
const { states, local_government_area, tax_payers } = require("../model/texPayersmodels");
const { assessment_item_invoices } = require('../model/assessmentModels');


async function getPaymentPage(req, res){
    try {
       
        res.status(200).render('./home/make_payment')
    } catch (error) {
        console.log(error);
    }
}

async function searchPayment(req, res) {
    try {
        let invoice = req.body.invoice;
        const data = await db.query(`
            SELECT 
                assessment_item_invoices.taxpayer_rin, 
                assessment_item_invoices.invoice_number, 
                assessment_item_invoices.taxpayer_rin, 
                assessment_items.assessment_item_name,
                assessment_item_invoices.amount
            FROM assessment_item_invoices
            INNER JOIN assessment_items ON assessment_item_invoices.assessment_item_id = assessment_items.assessment_item_id
            WHERE assessment_item_invoices.invoice_number = '${invoice}'
        `, {type: Sequelize.QueryTypes.SELECT});
        // console.log(data[0]);
        const tin = data ? data[0].taxpayer_rin : "";
        const taxPayer = await tax_payers.findOne({
            attributes: {exclude: ['passwordr']},
              where: {
                [Op.or]: [
                    { taxpayer_rin: tin },
                    { taxpayer_tin: tin },
                ]
            },
            raw:true
        })

        // console.log(taxPayer)
        res.status(200).render('./home/make_payment_record', {
            data, taxPayer
        })
    } catch (error) {
        req.flash('danger', error.message);
        res.redirect('back')
    }
}


async function validateReceipt(req, res) {
    res.status(200).render('./home/validate_receipt')
}


module.exports.generateInvoice = async (req, res) => {

}

async function generateTinAndAcc_get(req, res){
    let state = await states.findAll();
    let lga = await local_government_area.findOne({ where: { state_id: 5 } });
    res.render('generate_tin', {
        state,
        lga
    })
}

async function storeTin(req, res) {
    try {
        let { error, value } = createTinAndAccount.validate(req.body);
        if (error) {
            res.status(201).json({ msg: error.message })
        } else {
            let userInfo = {
                group_id: await groupId(value.usertype),
                name: value.fullname,
                username: value.email,
                password: await _Encrypt(value.password),
                email: value.email,
                user_phone: value.Number,
            }
            // let userInput = value.userType == "individual" ? await individual(value) : organization(value)
        }
    } catch (error) {

    }
}


async function groupId(utype) {
    return usertype == "individual" ? "190"
        : usertype == "corperte" ? "200"
            : usertype == "state_agency" ? "300"
                : "400";
}

async function _Encrypt(text) {
    return await bcrypt.hash(text, saltRounds);
}

async function individual(data) {
    let obj = {
        lastname: date.value,
        middlename: date.value,
        firstname: date.value,
        mobile_number_1: date.Number,
        email_addresss_1: date.email,
        tax_payer_type: date.usertype,
        contactaddress: date.value,
        state_id: date.state,
        lga_id: date.lga,
    }

    return obj;
}

module.exports = {
    getPaymentPage,
    validateReceipt,
    generateTinAndAcc_get,
    storeTin,
    searchPayment
}

/* fullname
email
Number
state
lga
password1 */