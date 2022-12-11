const compression = require('compression');
const express = require('express');
const helmet = require("helmet");
const bodyParser = require('body-parser')
let cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
const session = require('express-session');

// routes 

const auth = require('./src/routes/auth');
// const admin = require('./src/routes/admin');
const admin = require('./src/routes/admin');
const api = require('./src/routes/api');
const agency = require('./src/routes/agency');
const client = require('./src/routes/client');
const mandate = require('./src/routes/mandate');
const receipt = require('./src/routes/receipt');
const { requireAuth, checkUser } = require('./src/middleware/authMiddleware');
const self = require('./src/routes/selfassessment');
const report = require('./src/routes/report');
const pay = require('./src/routes/pay');
const settings = require('./src/routes/settings');
const ajaxreq = require('./src/routes/ajaxreq');
const office = require('./src/routes/offices');
const cbs = require('./src/routes/cbs');
const paystacts = require('./src/routes/payment/paystackPaymentRoute');
const payst = require('./src/routes/payment/paystackPaymentRoute');




const app = express();
// app.use(helmet());

// app.use(compression())
// app.use(express.urlencoded());
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());

app.use(cookieParser())
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: process.env.SESSION_SECRECT,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 3
    }
  }));



app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get("*", function(req, res, next){
  //res.locals.cart = req.session.cart;
  res.locals.link = req.originalUrl;
  next();
});

// static files
app.use(express.static('public'));


//view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')




app.use(checkUser)
app.get('/', async (req, res) => {
    res.render('index')
})


function main() {
    let PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log("APP RUNNING ON PORT", PORT)
    })

    app.use(auth);
    app.use(ajaxreq)

    app.use('/admin', requireAuth, admin);
    app.use('/api', api);
    app.use('/agency', agency);
    app.use('/client', client);
    app.use('/generate', requireAuth, mandate);
    app.use('/receipts', requireAuth, receipt);
    app.use('/self/assessment', requireAuth, self);
    app.use('/report', requireAuth, report);
    
    app.use('/pay', pay)
    app.use('/settings', requireAuth, settings)
    app.use('/office', requireAuth, office)
    app.use('/cbs/admin', requireAuth, cbs)
    api.use(payst)

}

main();

//error handling
// app.use(function(req, res, next){
//   const err = new Error("Not found");
//   err.status = 404;
//   next(err);
//  });
//  app.use((err, req, res, next)=>{
//      console.log(err)
//   res.status(err.status || 500);
//   let pag = err.status == 404? './error/error_404' : './error/error'
//   res.render(pag,{
//      error:{
//       status: err.status || 500,
//       message: err.message,
//      }
//   })
//  })
