const express = require('express')


const authController = require('../controllers/authController')
const auth = express.Router();




auth.route('/signup')
    .get(authController.signup_get)
    .post(authController.signup_post);

auth.route('/login')
    .get(authController.login_get)
    .post( authController.login_post)
auth.get('/logout', authController.logout_get)

auth.get('/login/success', authController.loginSuccess)


auth.route('/forget_password')
.get(authController.forgetpassword_get)
.post(authController.sendOtp)

auth.post('/verify_otp', authController.verifyOtp)


auth.route('/reset_password')
.get(authController.resetPassword_get)
.post(authController.resetPassword_post)


module.exports = auth;