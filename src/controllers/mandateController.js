
const { Sequelize, QueryTypes } = require('sequelize');
const Op = Sequelize.Op;
const db = require('../db/db')
const { validateTin } = require("../config/validation");
const { assessment_item_invoices, assessment_items, assessments } = require("../model/assessmentModels");
const { tax_payers } = require("../model/texPayersmodels");




// error handler 
const handleError = (err) => {

    return err;
}

module.exports.generateMandate_get = async (req, res) => {
    res.render('./admin/mandate/generate_mandate')
}

function taxrin(len) {
    len = len || 100;
    var nuc = "0123456789";
    var i = 0;
    var n = 0;
    s = "";
    while (i <= len - 1) {
        n = Math.floor(Math.random() * 4);
        s += nuc[n];
        i++;
    }
    return s;
}

function paymentRefere(len) {
    len = len || 100;
    var nuc = "0123456789";
    var i = 0;
    var n = 0;
    s = "N-AMAC";
    while (i <= len - 1) {
        n = Math.floor(Math.random() * 4);
        s += nuc[n];
        i++;
    }
    return s;
}

module.exports.getTapayersDetails = async (req, res) => {

    try {
        // res.send(req.body)
        const { error, value } = validateTin.validate(req.body);
        if (error) {
            res.status(201).json({ "err": error.message })
        } else {
            let tin = value.tin;
            let taxPayerDetail = await tax_payers.findOne({ where: { taxpayer_rin: tin } });
            if (taxPayerDetail) {
                console.log("done")
                res.status(200).json({ tin: tin })
            } else {
                res.status(201).json({ "err": "Tin not found" })
            }
        }
    } catch (err) {
        res.status(201).json({ "err": err.message })
    }
}




module.exports.generateInvoice_get = async (req, res) => {
    let taxPayerTin = req.query.tin_number;
    let invoice = req.query.invoice;

    let taxPayerDetail = await tax_payers.findOne({ where: { taxpayer_rin: taxPayerTin } });
    let assessment_item = await assessment_items.findAll();
    let rows = await db.query(`
        SELECT
        *
    FROM
        assessment_item_invoices
    INNER JOIN assessment_items ON assessment_item_invoices.assessment_item_id = assessment_items.assessment_item_id
    WHERE assessment_item_invoices.invoice_number = ${invoice} `, { type: QueryTypes.SELECT })

    let count = await assessment_item_invoices.count({ where: { invoice_number: invoice } })

    // console.log(taxPayerDetail)
    res.render('./admin/mandate/mandate', {
        assessment_item, taxPayerDetail, count, rows, taxPayerTin, invoice
    })
}



module.exports.generateInvoice_post = async (req, res) => {
    try {
        let arr = req.body;
        let arr1 = [];
        let tin = '';
        let input = ''
        let invoiceNumb = '';

        for (let i = 0; i < arr.length; i++) {
            const name = arr[i].name;
            name == "assessment_item_name" ? arr1.push(arr[i].value) : '';
            name == "tin_number" ? tin = arr[i].value : '';
            name == "invoice" ? invoiceNumb = arr[i].value : '';
            name == "submiop" ? input = arr[i].value : '';


        }

        // console.log(arr1, tin, invoiceNumb, req.query.username)

        switch (input) {
            case "store":
                var upload = [];
                arr1.forEach(async (itm) => {


                    let ASSN = {
                        ref_no: taxrin(20),
                        taxpayer_rin: tin,
                        assessment_ref: invoiceNumb,
                        assessment_item_id: itm,
                        date_log: new Date(),
                        amount: await itemAmount(itm),
                        invoice_number: invoiceNumb,
                        created_by: req.user.username,
                        assessment_ref: invoiceNumb,
                        tax_month: new Date().getMonth() + 1,
                        tax_year: new Date().getFullYear(),
                        profile_ref: invoiceNumb,
                        revenue_stream: 'REVENUE',
                        service_id: req.user.service_id,
                        tax_office_id: req.user.tax_office_id
                    }
                    console.log(ASSN)
                    let newAss = new assessment_item_invoices(ASSN);
                    newAss.save();
                    // upload.push(ASSN)


                })

                console.log(upload)

                // assessment_item_invoices.bulkCreate(upload).then(() => {
                res.status(200).json({ tin: tin, invoice_n: invoiceNumb })
                // })



                break;

            default:
                break;
        }


    } catch (err) {
        res.status(201).json({ "err": err.message })
    }

}

async function itemAmount(n) {
    let amount = await assessment_items.findOne({ attributes: ['tax_base_amount'], where: { assessment_item_id: n } })
    if (amount) {
        return amount.tax_base_amount
    } else {
        return 0
    }
}

module.exports.deleteAssessmnt = async (req, res) => {
    try {
        switch (req.body.input) {
            case "finish_transaction":
                let t = await db.transaction()
                try {
                    let updateTransaction = await db.query(`UPDATE assessment_item_invoices SET locked=1 WHERE invoice_number=${req.body.invoice}`, );
                    if (updateTransaction) {
                        let newRef = paymentRefere(6);
                        let curd = new Date()
                        let dd = curd.toLocaleString();
                        let updateRerence = await db.query(`UPDATE assessment_item_invoices SET invoice_number='${newRef}', assessment_ref= '${newRef}' WHERE invoice_number=${req.body.invoice}`, { transaction: t });
                        if (updateRerence) {
                            let finishT = await db.query(`SELECT taxpayer_rin, invoice_number, SUM(amount) as total, created_by, tax_month, tax_year from assessment_item_invoices WHERE invoice_number='${req.body.invoice}' and locked=1`, { type: QueryTypes.SELECT });
                            console.log(finishT)
                            if (finishT) {
                                console.log(finishT[0])
                                let taxPayerDetail = await tax_payers.findOne({ where: { taxpayer_rin: finishT[0].taxpayer_rin } });
                                console.log(taxPayerDetail)
                                let obj = {
                                    assessment_ref: `${newRef}`,
                                    tax_payer_type: taxPayerDetail.tax_payer_type,
                                    tax_payer_rin: finishT[0].taxpayer_rin,
                                    tax_payer_name: taxPayerDetail.taxpayer_name,
                                    tax_year: finishT[0].tax_year,
                                    tax_month: finishT[0].tax_month,
                                    assessment_amount: finishT[0].total,
                                    invoice_number: `${newRef}`,
                                    created_by: finishT[0].created_by,
                                    service_id: 2344170253,
                                    tax_office_id: req.user.tax_office_id
                                }

                                console.log(obj)

                                // let newAssesment = new assessments(obj)
                                assessments.create(obj, { transaction: t }).then(async() => {
                                    await t.commit();
                                    res.status(200).json({ tin: req.body.tin, invoice_n: newRef })
                                })
                               

                            }

                        } else {
                            res.status(201).json({ err: 'Assessments not locked for payment' })
                        }

                    } else {
                        res.status(201).json({ err: 'Opps something happened' })
                    }
                } catch (error) {
                    await t.rollback();
                    console.log(error)
                    const err = handleError(error);

                    res.status(400).json({ err: err.message });
                }

                // assessment_item_invoices.update({locked:1}, {where: {invoice_number: req.body.invoice}}).then(function(){

                // }).
                break;

            default:
                let arr = req.body;
                let arr1 = [];
                let tin = '';
                // let input = ''
                let invoiceNumb = '';

                for (let i = 0; i < arr.length; i++) {
                    const name = arr[i].name;
                    name == "id_assessment_item_invoices" ? arr1.push(arr[i].value) : '';
                    name == "tin_number" ? tin = arr[i].value : '';
                    name == "invoice" ? invoiceNumb = arr[i].value : '';
                    // name == "submiop" ? input = arr[i].value : '';
                }

                // let newArr = arr1.toString();
                // let str = newArr.replace(/(^"|"$)/g, '');

                assessment_item_invoices.destroy({ where: { id_assessment_item_invoices: { [Op.in]: arr1 } } }).then(() => {
                    res.status(200).json({ tin: tin, invoice_n: invoiceNumb })
                })
                break;
        }

    } catch (error) {
        console.log(error)
        const err = handleError(error);

        res.status(400).json({ err });
    }
}