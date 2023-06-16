const { Sequelize, QueryTypes } = require('sequelize');
const db = require('../db/db');
const { tax_offices, assessment_items } = require('../model/assessmentModels');



module.exports.report_get = async (req, res) => {
    let offices = await tax_offices.findAll();
    let items = await assessment_items.findAll()
    res.render('./report/report', {
        offices, items
    })

}
module.exports.transactionReport = async (req, res) => {
    //  res.send(req.query)
    if(req.user.group_id == 205 || req.user.group_id == 200){
        let perPage = 20;   // number of records per page
        var page = req.query.page || 1
        let offset = perPage * page - perPage;

        let prm = req.query;
        let sql = `
            SELECT
                *
            FROM
                assessments
            JOIN tax_payers ON assessments.tax_payer_rin = tax_payers.taxpayer_rin
            LEFT JOIN users ON assessments.created_by = users.username
            JOIN tax_offices ON assessments.tax_office_id = tax_offices.id_tax_office 
            WHERE assessments.settlement_status=1
            AND assessments.tax_office_id = ${req.user.tax_office_id}
        `;


        if (req.query.tax_payer_name) {
            sql += ` AND assessments.tax_payer_name like  '%${req.query.tax_payer_name}%'`
        }

        if (req.query.office) {
            sql += ` AND assessments.tax_office_id like  '%${req.query.office}%'`
        }

        if (req.query.tax_payer_rin) {
            sql += ` AND assessments.tax_payer_rin like  '%${req.query.tin}%'`
        }

        if (req.query.invoice_number) {
            sql += ` AND assessments.invoice_number like  '%${req.query.invoice_number}%'`
        }

        if (req.query.registered_on & req.query.registered_to) {
            sql += ` AND date(assessments.settlement_date) BETWEEN   '${req.query.registered_on}' AND '${req.query.registered_to}'`
        }
        let cnt = await db.query(sql, { type: QueryTypes.SELECT }); // for  count to capture the totaal number before appending the limit

        sql += ` LIMIT ${perPage} OFFSET ${offset};`

        let view_mandate = await db.query(sql, { type: QueryTypes.SELECT });
        let count = cnt.length;
        console.log(count)


        let offices = await tax_offices.findAll();
        let items = await assessment_items.findAll()

        let uri2 = `/report/transaction?office=${prm.office}&tin=${prm.tin}&registered_on=${prm.registered_on}&registered_to=${prm.registered_to}&settlement_status=1&Button_DoSearch=Search`;
        let uri1 = "/report/transaction?"
        res.render('./report/report', {
            current: page,
            pages: Math.ceil(count / perPage),
            offices,
            items,
            view_mandate,
            prm: prm.Button_DoSearch,
            uri2, uri1
        })
    } else {
        let perPage = 20;   // number of records per page
        var page = req.query.page || 1
        let offset = perPage * page - perPage;

        let prm = req.query;
        let sql = `
            SELECT
                *
            FROM
                assessments
            JOIN tax_payers ON assessments.tax_payer_rin = tax_payers.taxpayer_rin
            LEFT JOIN users ON assessments.created_by = users.username
            JOIN tax_offices ON assessments.tax_office_id = tax_offices.id_tax_office WHERE assessments.settlement_status=1
        `;


        if (req.query.tax_payer_name) {
            sql += ` AND assessments.tax_payer_name like  '%${req.query.tax_payer_name}%'`
        }

        if (req.query.office) {
            sql += ` AND assessments.tax_office_id like  '%${req.query.office}%'`
        }

        if (req.query.tax_payer_rin) {
            sql += ` AND assessments.tax_payer_rin like  '%${req.query.tin}%'`
        }

        if (req.query.invoice_number) {
            sql += ` AND assessments.invoice_number like  '%${req.query.invoice_number}%'`
        }

        if (req.query.registered_on & req.query.registered_to) {
            sql += ` AND date(assessments.settlement_date) BETWEEN   '${req.query.registered_on}' AND '${req.query.registered_to}'`
        }
        let cnt = await db.query(sql, { type: QueryTypes.SELECT }); // for  count to capture the totaal number before appending the limit

        sql += ` LIMIT ${perPage} OFFSET ${offset};`

        let view_mandate = await db.query(sql, { type: QueryTypes.SELECT });
        let count = cnt.length;
        console.log(count)


        let offices = await tax_offices.findAll();
        let items = await assessment_items.findAll()

        let uri2 = `/report/transaction?office=${prm.office}&tin=${prm.tin}&registered_on=${prm.registered_on}&registered_to=${prm.registered_to}&settlement_status=1&Button_DoSearch=Search`;
        let uri1 = "/report/transaction?"
        res.render('./report/report', {
            current: page,
            pages: Math.ceil(count / perPage),
            offices,
            items,
            view_mandate,
            prm: prm.Button_DoSearch,
            uri2, uri1
        })
    }
}


module.exports.transactionReportItem = async (req, res) => {
    //  try {
     console.log(req.query)
    if(req.user.group_id == 205 || req.user.group_id == 200){
        let perPage = 20;   // number of records per page
        var page = req.query.page || 1
        let offset = perPage * page - perPage;
    
        let prm = req.query;
        let sql = `
                SELECT
                    *
                FROM
                assessment_item_invoices
                JOIN tax_payers ON assessment_item_invoices.taxpayer_rin = tax_payers.taxpayer_rin
                LEFT JOIN users ON assessment_item_invoices.created_by = users.username
                INNER JOIN assessment_items ON assessment_item_invoices.assessment_item_id = assessment_items.assessment_item_id
                JOIN tax_offices ON assessment_item_invoices.tax_office_id = tax_offices.id_tax_office 
                WHERE 
                  assessment_item_invoices.paid = 1 
                  AND assessment_item_invoices.tax_office_id = ${req.user.tax_office_id}`;
    
    
    
    
        if (req.query.office) {
            sql += ` AND assessment_item_invoices.tax_office_id like  '%${req.query.office}%'`
        }
    
        if (req.query.item) {
            sql += ` AND assessment_item_invoices.assessment_item_id like  '%${req.query.item}%'`
        }
    
        if (req.query.tax_payer_rin) {
            sql += ` AND assessment_item_invoices.taxpayer_rin like  '%${req.query.tin}%'`
        }
    
        if (req.query.invoice_number) {
            sql += ` AND assessment_item_invoices.invoice_number like  '%${req.query.invoice_number}%'`
        }
    
        if (req.query.registered_on & req.query.registered_to) {
            sql += ` AND date(assessment_item_invoices.date_log) BETWEEN   '${req.query.registered_on}' AND '${req.query.registered_to}'`
        }
    
    
        if (prm.Button_DoSearch == "Search") {
    
            let cnt = await db.query(sql, { type: QueryTypes.SELECT }); // for  count to capture the totaal number before appending the limit
    
            sql += ` LIMIT ${perPage} OFFSET ${offset};`
            let view_mandate = await db.query(sql, { type: QueryTypes.SELECT });
            let count = cnt.length;
    
    
            let offices = await tax_offices.findAll();
            let items = await assessment_items.findAll()
    
            let uri2 = `/report/transaction_by_items?office=${prm.office}&tin=${prm.tin}&registered_on=${prm.registered_on}&registered_to=${prm.registered_to}&invoice_number=${prm.invoice_number}&Button_DoSearch=Search`;
            let uri1 = "/report/transaction_by_items?"
            res.render('./report/report_by_item', {
                current: page,
                pages: Math.ceil(count / perPage),
                offices,
                items,
                view_mandate,
                prm: prm.Button_DoSearch,
                uri2, uri1
            })
        } else {
            let offices = await tax_offices.findAll();
            let items = await assessment_items.findAll()
    
            let uri2 = `/report/transaction_by_items?office=${prm.office}&tin=${prm.tin}&registered_on=${prm.registered_on}&registered_to=${prm.registered_to}&invoice_number=${prm.invoice_number}&Button_DoSearch=Search`;
            let uri1 = "/report/transaction_by_items?"
            res.render('./report/report_by_item', {
                current: page,
                pages: Math.ceil(0 / perPage),
                offices,
                items,
                view_mandate: '',
                prm: prm.Button_DoSearch,
                uri2, uri1
            })
        }
    } else {
        let perPage = 20;   // number of records per page
        var page = req.query.page || 1
        let offset = perPage * page - perPage;
    
        let prm = req.query;
        let sql = `
                SELECT
                    *
                FROM
                assessment_item_invoices
                JOIN tax_payers ON assessment_item_invoices.taxpayer_rin = tax_payers.taxpayer_rin
                LEFT JOIN users ON assessment_item_invoices.created_by = users.username
                INNER JOIN assessment_items ON assessment_item_invoices.assessment_item_id = assessment_items.assessment_item_id
                JOIN tax_offices ON assessment_item_invoices.tax_office_id = tax_offices.id_tax_office WHERE assessment_item_invoices.paid = 1 `;
    
    
    
    
        if (req.query.office) {
            sql += ` AND assessment_item_invoices.tax_office_id like  '%${req.query.office}%'`
        }
    
        if (req.query.item) {
            sql += ` AND assessment_item_invoices.assessment_item_id like  '%${req.query.item}%'`
        }
    
        if (req.query.tax_payer_rin) {
            sql += ` AND assessment_item_invoices.taxpayer_rin like  '%${req.query.tin}%'`
        }
    
        if (req.query.invoice_number) {
            sql += ` AND assessment_item_invoices.invoice_number like  '%${req.query.invoice_number}%'`
        }
    
        if (req.query.registered_on & req.query.registered_to) {
            sql += ` AND date(assessment_item_invoices.date_log) BETWEEN   '${req.query.registered_on}' AND '${req.query.registered_to}'`
        }
    
    
        if (prm.Button_DoSearch == "Search") {
    
            let cnt = await db.query(sql, { type: QueryTypes.SELECT }); // for  count to capture the totaal number before appending the limit
    
            sql += ` LIMIT ${perPage} OFFSET ${offset};`
            let view_mandate = await db.query(sql, { type: QueryTypes.SELECT });
            let count = cnt.length;
    
    
            let offices = await tax_offices.findAll();
            let items = await assessment_items.findAll()
    
            let uri2 = `/report/transaction_by_items?office=${prm.office}&tin=${prm.tin}&registered_on=${prm.registered_on}&registered_to=${prm.registered_to}&invoice_number=${prm.invoice_number}&Button_DoSearch=Search`;
            let uri1 = "/report/transaction_by_items?"
            res.render('./report/report_by_item', {
                current: page,
                pages: Math.ceil(count / perPage),
                offices,
                items,
                view_mandate,
                prm: prm.Button_DoSearch,
                uri2, uri1
            })
        } else {
            let offices = await tax_offices.findAll();
            let items = await assessment_items.findAll()
    
            let uri2 = `/report/transaction_by_items?office=${prm.office}&tin=${prm.tin}&registered_on=${prm.registered_on}&registered_to=${prm.registered_to}&invoice_number=${prm.invoice_number}&Button_DoSearch=Search`;
            let uri1 = "/report/transaction_by_items?"
            res.render('./report/report_by_item', {
                current: page,
                pages: Math.ceil(0 / perPage),
                offices,
                items,
                view_mandate: '',
                prm: prm.Button_DoSearch,
                uri2, uri1
            })
        }
    }
    




}

module.exports.individualTransactions = async (req, res) => {
    let sql = `
        SELECT
            *
        FROM
        assessment_item_invoices
        JOIN tax_payers ON assessment_item_invoices.taxpayer_rin = tax_payers.taxpayer_rin 
        INNER JOIN assessment_items ON assessment_item_invoices.assessment_item_id = assessment_items.assessment_item_id
         WHERE assessment_item_invoices.taxpayer_rin = ${req.user.username} `;

    let view_mandate = await db.query(sql, { type: QueryTypes.SELECT });

    res.render('./report/transaction_history', {
        view_mandate
    })
}


module.exports.AgentAssessments = async (req, res) => {
    
}