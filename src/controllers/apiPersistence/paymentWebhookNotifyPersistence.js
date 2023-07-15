const { api_payment_notification } = require("../../model/paymentModel")

module.exports = {
    sendPaymentNotification: async function(payload) {
        try {
            const notification = await api_payment_notification.findOne({where: {invoice_number: payload.invoice_number}});
            if(notification){
                notification.update(payload);
                if(notification.isRepeat == 1) {
                    // TODO: send notification again
                } else {
                    return 1;
                }
            } else {
                // TODO send notification
            }
        } catch (error) {
            throw Error(error.message)
        }
    }
}