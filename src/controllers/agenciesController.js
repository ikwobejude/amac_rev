const bcrypt = require('bcrypt');

const { Sequelize, QueryTypes } = require('sequelize');
const Op = Sequelize.Op;
const db = require('../db/db')
const saltRounds = 10;

const { agencyType, agenciesv } = require("../config/validation");
const { agencies, agency_types, agent_assessments, tax_payers } = require("../model/texPayersmodels");
const { Users } = require('../model/userModel');


const errorHandling = (err) => {
    return err
}


module.exports.dashboard = async (req, res) => {
    let assess = await agent_assessments.sum('assessed_amount');
    let payment = await agent_assessments.sum("assessed_amount", { where: { settlement_status: 1 } });
    let unpais = await agent_assessments.sum("assessed_amount", { where: { settlement_status: 0 } });

    res.render('./agencies2/dashboard', {
        assess,
        payment,
        unpais
    })
}




module.exports.agency_type_get = async (req, res) => {
    let types = await agency_types.findAll();
    res.render('./settings/agency_types', {
        types
    })
}

module.exports.agency_type_post = async (req, res) => {
    try {
        let { error, value } = agencyType.validate(req.body);
        if (error) {
            let err = errorHandling(error);
            res.status(201).json({ err: err.message })
        } else {

            let t1 = await db.transaction();

            try {

                let payload = {
                    agency_type: value.agency_type,
                    service_id: req.user.service_id,
                    created_by: req.user.created_by,
                    created_at: new Date(),
                    organization_id: req.user.organization_code,
                }

                const agencyType = await agency_types.create(payload, { transaction: t1 });
                // If the execution reaches this line, no errors were thrown.
                // We commit the transaction.
                await t1.commit();

                res.status(200).json({ msg: "Created" })
            } catch (error) {
                await t1.rollback();
                let err = errorHandling(error);
                res.status(201).json({ err: err.message })

            }

        }
    } catch (error) {
        let err = errorHandling(error);
        res.status(201).json({ err: err.message })
    }
}


module.exports.createAgents_get = async (req, res) => {
    try {
        let revAgencies = await agencies.findAll()
        let agencyT = await agency_types.findAll();

        res.render('./agencies2/agencies', {
            revAgencies, agencyT
        })
    } catch (error) {
        console.log(error)
    }


}



module.exports.createAgents_post = async (req, res) => {
    try {
        console.log(req.body)
        let { error, value } = agenciesv.validate(req.body);
        if (error) {
            let err = errorHandling(error);
            res.status(201).json({ err: err.message })
        } else {

            let t1 = await db.transaction();

            try {
                let payload = {
                    agency_type: value.agency_type,
                    agency_name: value.agency_name.toUpperCase(),
                    service_id: req.user.service_id,
                    created_by: req.user.created_by,
                    agency_email: value.agency_email,
                    agency_phone: value.agency_phone,
                    created_at: new Date(),
                    organization_id: req.user.organization_code,
                }

                let acnt = {
                    name: value.agency_name.toUpperCase(),
                    group_id: 999999, // agencies group id
                    username: value.agency_email,
                    email: value.agency_email,
                    user_phone: value.agency_phone,
                    password: await bcrypt.hash("1234567", saltRounds),
                    organization_code: req.user.organization_code
                }

                const agency = await agencies.create(payload, { transaction: t1 });
                const users = await Users.create(acnt, { transaction: t1 })
                // If the execution reaches this line, no errors were thrown.
                // We commit the transaction.
                await t1.commit();

                res.status(200).json({ msg: "Created" })
            } catch (error) {
                await t1.rollback();
                let err = errorHandling(error);
                res.status(201).json({ err: err.message })

            }

        }
    } catch (error) {
        let err = errorHandling(error);
        res.status(201).json({ err: err.message })
    }
}


module.exports.deleteAgencyType = async (req, res) => {
    try {
        console.log(req.body)

        agency_types.destroy({ where: { agency_type_id: req.body.id } })
            .then(function () {
                res.status(200).json({ msg: "Deleted" })
            })
    } catch (error) {
        let err = errorHandling(error);
        res.status(201).json({ err: err.message })
    }
}


module.exports.agentReports = async (req, res) => {
    let perPage = 20;   // number of records per page
    var page = req.query.page || 1
    let offset = perPage * page - perPage;
    let settlement_status = 1;
    if (req.query.search == "search") {
        let data = await agent_assessments.findAll({
            where: {
                [Op.and]: [
                    settlement_status && { settlement_status: { [Op.like]: `${settlement_status}` } },
                    req.query.agent_rin && { agent_rin: { [Op.like]: `${req.query.agent_rin}` } },
                    req.query.taxpayer_rin && { taxpayer_rin: { [Op.like]: `${req.query.taxpayer_rin}` } },
                    req.query.invoice_number && { invoice_number: { [Op.like]: `${req.query.invoice_number}` } },
                    req.user.username && { entered_by: { [Op.like]: `${ req.user.username}` } }
                ],
            }
        });
        let count = await agent_assessments.count({
            where: {
                [Op.and]: [
                    settlement_status && { settlement_status: { [Op.like]: `${settlement_status}` } },
                    req.query.agent_rin && { agent_rin: { [Op.like]: `${req.query.agent_rin}` } },
                    req.query.taxpayer_rin && { taxpayer_rin: { [Op.like]: `${req.query.taxpayer_rin}` } },
                    req.query.invoice_number && { invoice_number: { [Op.like]: `${req.query.invoice_number}` } },
                    req.user.username && { entered_by: { [Op.like]: `${ req.user.username}` } }
                ],
            }

        });

        res.render('./report/view_agent_payment_report', {
            data,
            current: page,
            pages: Math.ceil(count / perPage)
        })

    } else {
        let data = await agent_assessments.findAll({ where: { entered_by: req.user.username, settlement_status: settlement_status }, limit: perPage, offset: offset, order: [['agent_assessment_id', 'DESC']] },);
        let count = await agent_assessments.count({ where: { entered_by: req.user.username, settlement_status: settlement_status }, perPage, offset: offset, order: [['agent_assessment_id', 'DESC']] },);
        res.render('./report/view_agent_payment_report', {
            data,
            current: page,
            pages: Math.ceil(count / perPage)
        })
    }

}


module.exports.cry = async(req, res) =>{
    const key = Buffer.from([0xE1, 0xAA]) // just 2 bytes for a 16 bit length key, just for demonstration
    const iv = Buffer.from([0xC2]) // for a 8 bit length
    const decipher = createDecipheriv('aes-256-cbc', key, iv) // this key and iv won't work as this algo needs a 256 length key and 128 length iv but I only added two and one bytes
    
    const deciphered = decipher.update(message) + decipher.final() // this is a Buffer now, so you need to call toString('utf8') to get it as a string
}



module.exports.viewTinHistory = async (req, res) => {
    tax_payers.hasMany(agent_assessments);
    agent_assessments.belongsTo(tax_payers);

    let taxpayer = await tax_payers.findAll({
        include: { agent_assessments }
    })
};
