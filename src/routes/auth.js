const express = require('express')


const authController = require('../controllers/authController');
const frontPageController = require('../controllers/frontPageController');
const router = express.Router();




router.route('/signup')
    .get(authController.signup_get)
    .post(authController.signup_post);

router.route('/login')
    .get(authController.login_get)
    .post( authController.login_post)
router.get('/logout', authController.logout_get)

router.get('/login/success', authController.loginSuccess)


router.route('/forget_password')
.get(authController.forgetpassword_get)
.post(authController.sendOtp)

router.post('/verify_otp', authController.verifyOtp)


router.route('/reset_password')
.get(authController.resetPassword_get)
.post(authController.resetPassword_post)




// basic routing 
router.get('/make_payment', frontPageController.getPaymentPage)
router.post('/make_payment', frontPageController.searchPayment)

module.exports = router;