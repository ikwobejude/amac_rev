const jwt = require('jsonwebtoken');
const { Users } = require('../model/userModel');
require('dotenv').config();

const requireAuth = (req, res, next) => {


    const token = req.cookies.jwt;

    // check json web token exists & verified

    if (token) {
        jwt.verify(token, process.env.JWT_SECRECT, (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                res.redirect('/login')
            } else {
                // console.log(decodedToken)
                next()
            }
        })
    } else {
        res.redirect('/login')
    }
}

// chck current user

const checkUser = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRECT, async(err, decodedToken) => {
            if (err) {
                req.flash("danger", err.message)
                res.redirect('/login')
            } else {
                let user = await Users.findOne({ attributes: {
                    exclude: ['password']
                }, where: { id: decodedToken.id } })
                res.locals.user = user.toJSON();
                req.user = user.toJSON();
                next()
            }
        })
    } else {
        res.locals.user = null;
        next()
    }
}



module.exports = {
    requireAuth, checkUser
}
