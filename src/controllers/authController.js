const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const nodemailer = require('nodemailer')

const { valideteUsersignup, loginUser, createTinAndAccount, validOtp, resetPwd } = require('../config/validation');
const { individual, companies } = require('../model/assessmentModels');
const { states, local_government_area } = require('../model/texPayersmodels');
const saltRounds = 10;

const { Users } = require("../model/userModel");
// const { sendEmail, sendOtpEmail } = require('../config/emailServices');
require('dotenv').config();


// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})


const masAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRECT, {
        expiresIn: masAge
    })
}


function taxrin(len) {
    len = len || 100;
    var nuc = "0123456789";
    var i = 0;
    var n = 0;
    s = '22';
    while (i <= len - 1) {
        n = Math.floor(Math.random() * 4);
        s += nuc[n];
        i++;
    }
    return s;
}


// error handler 
const handleError = (err) => {

    return err;
}

module.exports.signup_get = async (req, res) => {
    let state = await states.findAll();
    let lga = await local_government_area.findOne({ where: { state_id: 15 } });
    res.render("./home/generate_tin", {
        state,
        lga,
    })
}

async function _Encrypt(text) {
    return await bcrypt.hash(text, saltRounds);
}

module.exports.signup_post = async (req, res) => {

    try {
        const { error, value } = createTinAndAccount.validate(req.body)
        if (error) {
            res.status(201).json({ "err": error.message })
        } else {
            let userInpt = {
                group_id: value.usertype == "Individual" ? "190" : value.usertype == "Corperate" ? "200" : value.usertype == "State Agency" ? "300" : "400",
                name: value.name,
                username: taxrin(8),
                password: await bcrypt.hash(value.password1, saltRounds),
                email: value.email,
                user_phone: value.number,
            }
            let plainPass = value.password1

            console.log(userInpt, plainPass)

            let input = new Users(userInpt);
            input.save().then(async (newUser) => {
                // const token = createToken(newUser.id);
                // res.cookie('jwt', token, { httpOnly: true, masAge: masAge * 1000 })
                let tin = userInpt.username;
                if (value.usertype == "Individual") {
                    let userType = await individul(value, tin);
                    console.log(userType)
                    let newIndividual = new individual(userType);
                    newIndividual.save().then(() => {
                        // sendEmail(userInpt, plainPass);
                        res.status(200).json({ tin: tin })
                    })
                } else {
                    let userType = await companyDetails(value, tin)
                    let newCopertive = new companies(userType);
                    newCopertive.save().then(() => {
                        // sendEmail(userInpt, plainPass);
                        res.status(200).json({ tin: tin })
                    })
                }
            })
        }

    } catch (error) {

        console.log(error)
        const err = handleError(error);

        res.status(400).json({ err });
    }

}

module.exports.login_get = async (req, res) => {
    res.render("./auth/login", {
        tin: req.query.tin_number != '' ? req.query.tin_number : ""
    })
}

module.exports.login_post = async (req, res) => {
    try {
        const { error, value } = loginUser.validate(req.body)


        if (error) {
            let err = handleError(error)
            res.status(201).json({ "err": err.message })
        } else {
            const userInfo = await findUser(value.username, value.password);
            const token = createToken(userInfo.id);
            res.cookie('jwt', token, { httpOnly: true, masAge: masAge * 1000 })
            res.status(200).json({ user: userInfo.id, group : userInfo.group_id })
        }
    } catch (error) {
        console.log(error)
        let err = handleError(error)
        res.status(201).json({ "err": err.message })
    }

}


// success login
module.exports.loginSuccess = async (req, res) => {
    console.log(req.user)
    try {
        let dt = req.user;
        if (dt.group_id == 111111 || dt.group_id == 111000) {
            res.redirect('/admin/dashboard')
        } else if (dt.group_id == 190) {
            res.redirect('/self/assessment/dashboard')
        } else if (dt.group_id == 999999){
            res.redirect('/agency/dashboard')
        } else if (dt.group_id == 205 || dt.group_id == 200 ||  dt.group_id == 121212){
            res.redirect('/office/dashboard')
        } else {
            res.send(req.user)
        }
    } catch (error) {
        console.log(error)
    }

}

// forget password 
module.exports.forgetpassword_get = async (req, res) => {
    res.render('./auth/forget_password')
}


function opt(len) {
    len = len || 100;
    var nuc = "0123456789";
    var i = 0;
    var n = 0;
    s = '';
    while (i <= len - 1) {
        n = Math.floor(Math.random() * 4);
        s += nuc[n];
        i++;
    }
    return s;
}


module.exports.sendOtp = async (req, res) => {
    try {
        let user = await findUserDetail(req.body.dt)
        if (user) {
            let otp = opt(6);

            let id = user.id;
            //  console.log()
            Users.update({ reset_token: otp }, { where: { id: id } }).then(() => {
                // sendOtpEmail(user, otp)
                res.status(200).json({ msg: "success" })
            })

        }
    } catch (error) {
        let err = handleError(error)
        res.status(201).json({ "err": err.message })
    }
}



// 

module.exports.verifyOtp = async (req, res) => {
    try {
        let { error, value } = validOtp.validate(req.body);
        if (error) {
            let err = handleError(error)
            res.status(201).json({ "err": err.message })
        } else {
            let validOtp = await VerifyOtp(value.otp)
            if (validOtp) {
                res.status(200).json({ otp: value.otp })
            }
        }
    } catch (error) {
        let err = handleError(error)
        res.status(201).json({ "err": err.message })
    }
}

module.exports.resetPassword_get = async (req, res) => {
    res.render('./auth/create_new_password', {
        otp: req.query.opt
    })
}

module.exports.resetPassword_post = async (req, res) => {
    try {
        const { error, value } = resetPwd.validate(req.body)
        if (error) {
            let err = handleError(error)
            res.status(201).json({ "err": err.message })
        } else {
            Users.update({ password: await bcrypt.hash(value.password1, saltRounds) }, { where: { reset_token: value.otp } })
                .then(() => {
                    res.status(200).json({ "msg": "success" })
                })
        }
    } catch (error) {
        let err = handleError(error)
        res.status(201).json({ "err": err.message })
    }
}


module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}


async function findUser(username, password) {
    const user = await Users.findOne({
        where: {
            [Op.or]: [
                { username: username },
                { email: username }
            ]
        }
    })

    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user;
        }
        throw Error('incorrect Password')
    }
    throw Error('incorrect username')
}

async function findUserDetail(dt) {
    const user = await Users.findOne({
        where: {
            [Op.or]: [
                { username: dt },
                { email: dt },
                { user_phone: dt },
            ]
        }
    })

    if (user) {
        return user;
    }
    throw Error('User not found')
}


async function individul(data, tin) {
    let obj = {
        user_rin: tin,
        individual_name: data.name,
        individual_tin: tin,
        mobile_number_1: data.number,
        email_addresss_1: data.email,
        tax_payer_type: data.usertype,
        state_id: data.state,
        lga_id: data.lga_id,
    }

    return obj;
}

async function companyDetails(data, tin) {
    let obj = {
        company_rin: tin,
        company_name: data.name,
        mobile_number: data.number,
        email_addresss: data.email,
        tax_payer_type: data.usertype,
        state_id: data.state,
        lga_id: data.lga_id,
    }

    return obj;
}



async function VerifyOtp(utype) {
    const user = await Users.findOne({
        where: { reset_token: utype }
    })

    if (user) {
        return user;
    }
    throw Error('Invalid OTP')
}
