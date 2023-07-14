const { randomNum } = require("../../helper/helper");
const assessmentModels = require("../../model/assessmentModels");
const db = require('../../db/db')

async function generatePaymentInvoice(user, payload, invoiceNumber, metadata){
    try {
        const paymentReference = await assessmentModels.assessment_item_invoices.findOne({where: {profile_ref : payload.paymentReference }, raw:true});
        if(paymentReference){
            throw new Error("Payment reference cannot be unique");
        } else {
            let ASSN = {
                ref_no: randomNum(20),
                taxpayer_rin: payload.tin,
                date_log: new Date(),
                amount: payload.amount,
                invoice_number: invoiceNumber,
                created_by: metadata.username,
                assessment_ref: invoiceNumber,
                tax_month: new Date().getMonth() + 1,
                tax_year: new Date().getFullYear(),
                profile_ref: payload.paymentReference,
                revenue_stream: 'REVENUE',
                service_id: metadata.service_id,
                locked: 1
                // tax_office_id: metadata.tax_office_id
            }
            let obj = {
                assessment_ref: invoiceNumber,
                tax_payer_type: "INDIVIDUAL",
                tax_payer_rin:  metadata.username,
                tax_payer_name: payload.tax_payer_name,
                tax_year: new Date().getFullYear(),
                tax_month: new Date().getMonth() + 1,
                assessment_amount:  payload.amount,
                invoice_number: invoiceNumber,
                created_by:  payload.tin,
                service_id: 2344170253,
            }
            const t = await db.transaction();
            try {
                
                await assessmentModels.assessments.create(obj, { transaction: t })
               
    
                await assessmentModels.initializations.create({
                    callBacUrl: payload.callBackUrl,
                    paymentReference: payload.paymentReference,
                    billNumber: invoiceNumber,
                    amount: payload.amount,
                    service_id: metadata.service_id,
                    created_by:  metadata.username
                }, { transaction: t })
                // console.log(ASSN)
                await assessmentModels.assessment_item_invoices.create(ASSN, { transaction: t });
                // newAss.save({ transaction: t });
                await t.commit();
                return {
                    tin: user.tin,
                    reference: payload.paymentReference,
                    item: payload.paymentItem,
                    amount: payload.amount,
                    bill_reference: invoiceNumber,
                    callBackUrl: payload.callBackUrl,
            
                }
            } catch (error) {
                await t.rollback();
                throw Error(error.message)
            }
    
        }
    } catch (error) {
        throw Error(error.message)
    }
}

module.exports = {
    generatePaymentInvoice
}