

const { Sequelize, QueryTypes } = require('sequelize');
const Op = Sequelize.Op;
const db = require('../db/db')

const { assessments, assessment_item_invoices } = require("../model/assessmentModels");



module.exports.viewRevenueReceipt = async (req, res) => {


    let perPage = 20;   // number of records per page
    var page = req.query.page || 1
    let offset = perPage * page - perPage;
    let settlement_status = 0;
    if (req.user.group_id == 190) {
        if (req.query.search == "1") {

            let data = await assessments.findAll({
                where: {
                    [Op.and]: [
                        settlement_status && { settlement_status: { [Op.like]: `%${settlement_status}%` } },
                        req.query.tax_payer_name && { tax_payer_name: { [Op.like]: `%${req.query.tax_payer_name}%` } },
                        req.user.username && { tax_payer_rin: { [Op.like]: `${req.user.username}%` } },
                        req.query.invoice_number && { invoice_number: { [Op.like]: `%${req.query.invoice_number}%` } }
                    ],
                }
            });
            let count = await assessments.count({
                where: {
                    [Op.and]: [
                        settlement_status && { settlement_status: { [Op.like]: `%${settlement_status}%` } },
                        req.query.tax_payer_name && { tax_payer_name: { [Op.like]: `%${req.query.tax_payer_name}%` } },
                        req.user.username && { tax_payer_rin: { [Op.like]: `%${req.user.username}%` } },
                        req.query.invoice_number && { invoice_number: { [Op.like]: `%${req.query.invoice_number}%` } }
                    ],
                }

            });

            res.render('./receipt/view_revenue_invoices', {
                data,
                current: page,
                pages: Math.ceil(count / perPage)
            })
        }
        let data = await assessments.findAll({ where: { tax_payer_rin: req.user.username, settlement_status: settlement_status }, limit: perPage, offset: offset, order: [['assessment_id', 'DESC']] },);
        let count = await assessments.count({ where: { tax_payer_rin: req.user.username, settlement_status: settlement_status }, perPage, offset: offset, order: [['assessment_id', 'DESC']] },);
        res.render('./receipt/view_revenue_invoices', {
            data,
            current: page,
            pages: Math.ceil(count / perPage)
        })
    } else if(req.user.group_id == 200 || req.user.group_id == 205 || req.user.group_id == 121212){
        if (req.query.search == "1") {

            let data = await assessments.findAll({
                where: {
                    [Op.and]: [
                        settlement_status && { settlement_status: { [Op.like]: `%${settlement_status}%` } },
                        req.query.tax_payer_name && { tax_payer_name: { [Op.like]: `%${req.query.tax_payer_name}%` } },
                        req.query.tax_payer_rin && { tax_payer_rin: { [Op.like]: `%${req.query.tax_payer_rin}%` } },
                        req.query.invoice_number && { invoice_number: { [Op.like]: `%${req.query.invoice_number}%` } },
                        req.user.tax_office_id && { tax_office_id: { [Op.like]: `%${req.user.tax_office_id}%` } }
                    ],
                }
            });
            let count = await assessments.count({
                where: {
                    [Op.and]: [
                        settlement_status && { settlement_status: { [Op.like]: `%${settlement_status}%` } },
                        req.query.tax_payer_name && { tax_payer_name: { [Op.like]: `%${req.query.tax_payer_name}%` } },
                        req.query.tax_payer_rin && { tax_payer_rin: { [Op.like]: `%${req.query.tax_payer_rin}%` } },
                        req.query.invoice_number && { invoice_number: { [Op.like]: `%${req.query.invoice_number}` } },
                        req.user.tax_office_id && { tax_office_id: { [Op.like]: `%${req.user.tax_office_id}%` } }
                    ],
                }

            });

            res.render('./receipt/view_revenue_invoices', {
                data,
                current: page,
                pages: Math.ceil(count / perPage)
            })
        }
        let data = await assessments.findAll({ where: { settlement_status: settlement_status, tax_office_id: req.user.tax_office_id }, limit: perPage, offset: offset, order: [['assessment_id', 'DESC']] },);
        let count = await assessments.count({ where: { settlement_status: settlement_status, tax_office_id: req.user.tax_office_id}, limit: perPage, offset: offset, order: [['assessment_id', 'DESC']] },);
        res.render('./receipt/view_revenue_invoices', {
            data,
            current: page,
            pages: Math.ceil(count / perPage)
        })
    } else {
        if (req.query.search == "1") {

            let data = await assessments.findAll({
                where: {
                    [Op.and]: [
                        settlement_status && { settlement_status: { [Op.like]: `%${settlement_status}%` } },
                        req.query.tax_payer_name && { tax_payer_name: { [Op.like]: `%${req.query.tax_payer_name}%` } },
                        req.query.tax_payer_rin && { tax_payer_rin: { [Op.like]: `%${req.query.tax_payer_rin}%` } },
                        req.query.invoice_number && { invoice_number: { [Op.like]: `%${req.query.invoice_number}%` } },
                    ],
                }
            });
            let count = await assessments.count({
                where: {
                    [Op.and]: [
                        settlement_status && { settlement_status: { [Op.like]: `%${settlement_status}%` } },
                        req.query.tax_payer_name && { tax_payer_name: { [Op.like]: `%${req.query.tax_payer_name}%` } },
                        req.query.tax_payer_rin && { tax_payer_rin: { [Op.like]: `%${req.query.tax_payer_rin}%` } },
                        req.query.invoice_number && { invoice_number: { [Op.like]: `%${req.query.invoice_number}%` } }
                    ],
                }

            });

            res.render('./receipt/view_revenue_invoices', {
                data,
                current: page,
                pages: Math.ceil(count / perPage)
            })
        }
        let data = await assessments.findAll({ where: { settlement_status: settlement_status }, limit: perPage, offset: offset, order: [['assessment_id', 'DESC']] },);
        let count = await assessments.count({ where: { settlement_status: settlement_status }, limit: perPage, offset: offset, order: [['assessment_id', 'DESC']] },);
        res.render('./receipt/view_revenue_invoices', {
            data,
            current: page,
            pages: Math.ceil(count / perPage)
        })
    }

}


module.exports.viewPaymentIn = async (req, res) => {
    // try {
    // var rates = `${currentYear - 1}/${currentYear}`;

    let perPage = 20;   // number of records per page
    var page = req.query.page || 1
    let offset = perPage * page - perPage;
    let settlement_status = 1;

    if (req.user.group_id == 190) {
        if (req.query.search == "1") {

            let data = await assessments.findAll({
                where: {
                    [Op.and]: [
                        settlement_status && { settlement_status: { [Op.like]: `${settlement_status}` } },
                        req.query.tax_payer_name && { tax_payer_name: { [Op.like]: `${req.query.tax_payer_name}` } },
                        req.user.username && { tax_payer_rin: { [Op.like]: `${req.user.username}` } },
                        req.query.invoice_number && { invoice_number: { [Op.like]: `${req.query.invoice_number}` } }
                    ],
                }
            });
            let count = await assessments.count({
                where: {
                    [Op.and]: [
                        settlement_status && { settlement_status: { [Op.like]: `${settlement_status}` } },
                        req.query.tax_payer_name && { tax_payer_name: { [Op.like]: `${req.query.tax_payer_name}` } },
                        req.user.username && { tax_payer_rin: { [Op.like]: `${req.user.username}` } },
                        req.query.invoice_number && { invoice_number: { [Op.like]: `${req.query.invoice_number}` } }
                    ],
                }

            });

            res.render('./receipt/view_payment_receipt', {
                data,
                current: page,
                pages: Math.ceil(count / perPage)
            })
        }
        let data = await assessments.findAll({ where: { tax_payer_rin: req.user.username, settlement_status: settlement_status }, limit: perPage, offset: offset, order: [['assessment_id', 'DESC']] },);
        let count = await assessments.count({ where: { tax_payer_rin: req.user.username, settlement_status: settlement_status }, perPage, offset: offset, order: [['assessment_id', 'DESC']] },);
        res.render('./receipt/view_payment_receipt', {
            data,
            current: page,
            pages: Math.ceil(count / perPage)
        })
    } else if(req.user.group_id == 200 || req.user.group_id == 205  || req.user.group_id == 121212){
        if (req.query.search == "1") {

            let data = await assessments.findAll({
                where: {
                    [Op.and]: [
                        settlement_status && { settlement_status: { [Op.like]: `${settlement_status}` } },
                        req.query.tax_payer_name && { tax_payer_name: { [Op.like]: `${req.query.tax_payer_name}` } },
                        req.query.tax_payer_rin && { tax_payer_rin: { [Op.like]: `${req.query.tax_payer_rin}` } },
                        req.query.invoice_number && { invoice_number: { [Op.like]: `${req.query.invoice_number}` } },
                        req.user.tax_office_id && { tax_office_id: { [Op.like]: `${req.user.tax_office_id}` } }
                    ],
                }
            });
            let count = await assessments.count({
                where: {
                    [Op.and]: [
                        settlement_status && { settlement_status: { [Op.like]: `${settlement_status}` } },
                        req.query.tax_payer_name && { tax_payer_name: { [Op.like]: `${req.query.tax_payer_name}` } },
                        req.query.tax_payer_rin && { tax_payer_rin: { [Op.like]: `${req.query.tax_payer_rin}` } },
                        req.query.invoice_number && { invoice_number: { [Op.like]: `${req.query.invoice_number}` } },
                        req.user.tax_office_id && { tax_office_id: { [Op.like]: `${req.user.tax_office_id}` } }
                    ],
                }

            });

            res.render('./receipt/view_payment_receipt', {
                data,
                current: page,
                pages: Math.ceil(count / perPage)
            })
        }
        let data = await assessments.findAll({ where: { settlement_status: settlement_status, tax_office_id: req.user.tax_office_id }, limit: perPage, offset: offset, order: [['assessment_id', 'DESC']] },);
        let count = await assessments.count({ where: { settlement_status: settlement_status, tax_office_id: req.user.tax_office_id}, limit: perPage, offset: offset, order: [['assessment_id', 'DESC']] },);
        res.render('./receipt/view_payment_receipt', {
            data,
            current: page,
            pages: Math.ceil(count / perPage)
        })
    }  else {
        if (req.query.search == "1") {

            let data = await assessments.findAll({
                where: {
                    [Op.and]: [
                        settlement_status && { settlement_status: { [Op.like]: `${settlement_status}` } },
                        req.query.tax_payer_name && { tax_payer_name: { [Op.like]: `${req.query.tax_payer_name}` } },
                        req.query.tax_payer_rin && { tax_payer_rin: { [Op.like]: `${req.query.tax_payer_rin}` } },
                        req.query.invoice_number && { invoice_number: { [Op.like]: `${req.query.invoice_number}` } }
                    ],
                }
            });
            let count = await assessments.count({
                where: {
                    [Op.and]: [
                        settlement_status && { settlement_status: { [Op.like]: `${settlement_status}` } },
                        req.query.tax_payer_name && { tax_payer_name: { [Op.like]: `${req.query.tax_payer_name}` } },
                        req.query.tax_payer_rin && { tax_payer_rin: { [Op.like]: `${req.query.tax_payer_rin}` } },
                        req.query.invoice_number && { invoice_number: { [Op.like]: `${req.query.invoice_number}` } }
                    ],
                }

            });

            res.render('./receipt/view_payment_receipt', {
                data,
                current: page,
                pages: Math.ceil(count / perPage)
            })
        }
        let data = await assessments.findAll({ where: { settlement_status: settlement_status }, limit: perPage, offset: offset, order: [['assessment_id', 'DESC']] },);
        let count = await assessments.count({ where: { settlement_status: settlement_status }, perPage, offset: offset, order: [['assessment_id', 'DESC']] },);
        res.render('./receipt/view_payment_receipt', {
            data,
            current: page,
            pages: Math.ceil(count / perPage)
        })
    }


}


module.exports.success = async (req, res) => {
    let data = await assessments.findOne({ where: { invoice_number: req.query.transaction_invoices }, raw:true })
    res.render('./receipt/transaction_invoice', {
        data
    })

}

module.exports.allReceipts = async(req, res) => {
    let data = await db.query(`
    SELECT
            *
        FROM
            assessment_item_invoices
        INNER JOIN assessment_items ON assessment_item_invoices.assessment_item_id = assessment_items.assessment_item_id
        WHERE
            assessment_item_invoices.invoice_number='${req.query.invoice_number}'`,  {type: QueryTypes.SELECT} )
    res.render('./receipt/all_items_transaction', {
        data
    })
}


module.exports.sumarryReceipt = async (req, res) => {
    let view_mandate1 = await db.query(`
    SELECT
            *
        FROM
            assessment_item_invoices
        INNER JOIN assessment_items ON assessment_item_invoices.assessment_item_id = assessment_items.assessment_item_id
        WHERE
            assessment_item_invoices.invoice_number='${req.query.invoice_number}'`, { type: QueryTypes.SELECT });

    let view_mandate = await assessments.findOne({ where: { invoice_number: req.query.invoice_number } });

    res.render('./receipt/summary_rceipt', {
        view_mandate, view_mandate1
    })
}