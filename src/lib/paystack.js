
require('dotenv').config();
// const requests = require('requests');
const paystack = (request) => {
    const MySecretKey = process.env.paystack_live != ""? process.env.paystack_live : process.env.paystack_test;
    
    //replace the secret key with that from your paystack account
    const initializePayment = async(form, mycallback) => {
        const options = {
            url : 'https://api.paystack.co/transaction/initialize',
            headers : {
                authorization: MySecretKey,
                'content-type': 'application/json',
                'cache-control': 'no-cache'    
            },
            form
        }
        const callback = (error, response, body) => {
           
            return mycallback(error, body)
        }
        request.post(options, callback)
        
    }
    
    const verifyPayment1 = async(ref, mycallback) => {
        const options = {
            url : 'https://api.paystack.co/transaction/verify/'+encodeURIComponent(ref),
            headers : {
                authorization: MySecretKey,
                'content-type': 'application/json',
                'cache-control': 'no-cache'    
            }
        }
        const callback = (error, response, body) => {
            // console.log(body)
            return mycallback(error, body)
        }
        request(options, callback)
    }

    return {initializePayment, verifyPayment1};
}

module.exports = paystack;