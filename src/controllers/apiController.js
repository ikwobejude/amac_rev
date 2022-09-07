const { TaxTin, valideteUsersignup, initialPayment, verifyPaymentInvo } = require("../config/validation");
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
            res.status(201).json({ msg: error.message })
        }
        const taxPayerTin = {
            usertin: value.tax_payer_tin
        }

        let Vtin = await findValidTin(taxPayerTin.usertin)
        res.status(200).json({ msg: "Unique tin found", Vtin })

    } catch (error) {
        let err = handleError(error)
        res.status(201).json({ "err": err.message })
    }
}


module.exports.initilizePayment = async (req, res) => {
    try {
        const { error, value } = initialPayment.validate(req.body);
        if (error) {
            res.status(201).json({ msg: error.message })
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

                res.status(200).json({ msh: "Initialized", payload })
            }
        }
    } catch (error) {
        let err = handleError(error)
        res.status(201).json({ msg: err.mesaage })
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

