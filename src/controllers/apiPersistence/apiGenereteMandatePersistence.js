const { randomNum } = require("../../helper/helper");
const assessmentModels = require("../../model/assessmentModels");

async function generatePaymentInvoice(user, payload, invoiceNumber, metadata){

    const paymentReference = await assessmentModels.assessment_item_invoices.findOne({where: {profile_ref : payload.paymentReference }, raw:true});
    if(paymentReference){
        throw new Error("Payment reference cannot be unique");
    } else {
        let ASSN = {
            ref_no: randomNum(20),
            taxpayer_rin: user.tin,
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
        await assessmentModels.initializations.create({
            callBacUrl: payload.callBackUrl,
            paymentReference: payload.paymentReference,
            billNumber: invoiceNumber,
            amount: payload.amount,
            service_id: metadata.service_id,
            created_by:  metadata.username
        })
        // console.log(ASSN)
        let newAss = new assessmentModels.assessment_item_invoices(ASSN);
        newAss.save();
    
         return {
            tin: user.tin,
            reference: payload.paymentReference,
            item: payload.paymentItem,
            amount: payload.amount,
            bill_reference: invoiceNumber,
            callBackUrl: payload.callBackUrl,
    
        }
    }

}

module.exports = {
    generatePaymentInvoice
}