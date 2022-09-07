const express = require('express')


const authController = require('../controllers/authController')
const auth = express.Router();




auth.route('/signup')
    .get(async (req, res) => {
        authController.signup_get(req, res)
    })
    .post(async (req, res) => {
        authController.signup_post(req, res)
    });

auth.route('/login')
    .get(async (req, res) => {
        authController.login_get(req, res)
    })
    .post(async (req, res) => {
        authController.login_post(req, res)
    })
auth.get('/logout', (req, res)=> {
    authController.logout_get(req, res);
})

auth.get('/login/success', async(req, res)=> {
    authController.loginSuccess(req, res)
})


auth.route('/forget_password')
.get(async(req, res) => {
    authController.forgetpassword_get(req, res)
})
.post(async(req, res) => {
    authController.sendOtp(req, res)
})

auth.post('/verify_otp', async(req, res)=> {
    authController.verifyOtp(req, res);
})


auth.route('/reset_password')
.get(async(req, res) => {
    authController.resetPassword_get(req, res)
})
.post(async(req, res)=> {
    authController.resetPassword_post(req, res)
})


module.exports = auth;