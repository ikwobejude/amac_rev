
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const multer = require("multer");
const sharp = require('sharp');
// const Jimp = require("jimp");
// const isBase64 = require('is-base64');
// const base64toFile = require("node-base64-to-file");
const fs = require('fs');
const path = require('path');

// const walletController = require("../model/wallet/walletController");
const { extname } = require("path");
// const { Revenue_upload } = require("../model/revenue/allRevenueModels");
// const { tax_items } = require("../model/business/businessModel");


const masAge = 1 * 24 * 60 * 60;

exports.createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRECT, {
        expiresIn: masAge
    })
}


exports.createTokeMobile = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRECT, {
      expiresIn: '365d' // expires in 365 day
  })
}

exports.randomNum = (len) => {
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

exports.billref = (len) => {
  len = len || 100;
  var nuc = "0123456789";
  var i = 0;
  var n = 0;
  s = 'N-KLG';
  while (i <= len - 1) {
      n = Math.floor(Math.random() * 4);
      s += nuc[n];
      i++;
  }
  return s;
}

const apistorage = multer.memoryStorage();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });
  
  
exports.upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 2,
    },
    //fileFilter: fileFilter,
  });

  exports.apiupload = multer({
    storage: apistorage,
    limits: {
      fileSize: 1024 * 1024 * 2,
    },
    //fileFilter: fileFilter,
  });


exports.imgResizer = async(req, res, next) => {
  if(!req.file) return next();

  req.file.filename = `${masAge}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(500,500)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`uploads/${ req.file.filename}`)

    next()
}


const d = Date.now();
exports. currentYear = new Intl.DateTimeFormat("en", { year: "numeric" }).format(
  d
);


// exports.wallentPaymentTransaction = async(data, t) =>{
//   try {
//     // console.log(data)
//     let userInfo = {};
//     if(data.bill_ref_no.startsWith("N-KLG" )){
//       let revInfo = await Revenue_upload.findOne({attributes:['name_of_business'], where: {bill_ref_no:data.bill_ref_no }});
//       userInfo = revInfo.toJSON();
//     }

//     // console.log(userInfo)
//     const wallt = await walletController.wallet.findOne({where: {userId: data.id }});
//     const bal = parseFloat(wallt.balance) - parseFloat(data.amount);
//     console.log(bal)
//     wallt.update({balance: bal}, {new:true} , {transaction: t})
    
//     const walletHistroy = await walletController.walletTransaction.create({
//       userId: data.id,
//       isInflow: 2,
//       paymentMethod: "Cash",
//       currency: "NGN",
//       amount: data.amount,
//       walletid: wallt.idwallent,
//       transactionid: data.bill_ref_no,
//       // created_on: , 
//       status: "successful"
//     }, {transaction: t})

//     const tran = await walletController.Transaction.create({
//       userId: data.id,
//       name: userInfo ? userInfo.name_of_business : "",
//       isInflow: 2,
//       transactionId: data.bill_ref_no,
//       amount: data.amount,
//       currency:  "NGN",
//       paymentStatus: "successful",
//       paymentGateway: "AGENT",
//       description: data.tdescription  
//     }, {transaction: t})
  
//     return {...walletHistroy, ...tran};
//   } catch (error) {
//     console.log(error)
//     throw new Error(error)
//   }
 
// }


exports.createTaxItems = async(data) => {
  let newItems = await tax_items.bulkCreate(data)
  return newItems

}
  



exports.generatePasswordReset = async() =>{
    const resetPasswordToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordExpires = Date.now() + 3600000; //expires in an hour
    return {resetPasswordToken, resetPasswordExpires}
}



// exports.saveBase64imageToFile = async(data) => {
//   try {
//    let fileName = `${masAge}-${Date.now()}`;
//     const imageName= await base64toFile(data, { filePath: './uploads', fileName: fileName, types: ['jpg', 'jpeg', 'png'], fileMaxSize: 3145728 });
//     return imageName
//   } catch (error) {
//     throw Error(error)
//   }
// }

exports.saveBase64imageToFile = async(data) => {
  let patttern = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
  // console.log(data)
  let result = data.split(',')[1].match(patttern) ? "Base64" : "Not Base64";
  // console.log(result)
  if(result == "Base64"){
    try {
      let fileName = `${masAge}-${Date.now()}.jpeg`;
    
      let image = Buffer.from(data.split(',')[1], "base64");
      await sharp(image)
      .resize(612,383)
      .toFormat('jpeg')
      .jpeg({quality:90})
      .toFile(`uploads/${fileName}`)
      return `${fileName}`;
    } catch (err) {
      // console.log(err)
      // throw Error(err.message)
      return "mage not valid";
    }
      
  } else {
      return "mage not valid";
      // throw Error("Image not valid, Please convert image to base64", { statusCode: 417 })
  }
 
  
}


// exports.saveBase64imageToFile = async(data) => {
//   let patttern = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
//   let result = data.split(',')[1].match(patttern) ? "Base64" : "Not Base64";
//   if(result == "Base64"){
//     let fileName = `${masAge}-${Date.now()}.jpeg`;
    
//       let image = Buffer.from(data.split(',')[1], "base64");
//       Jimp.read(image).then(function (img) {
//           if (img.bitmap.width > 0 && img.bitmap.height > 0) {
//              img
//             .resize(612, 383) // resize
//             .quality(90) // set JPEG quality
//             .greyscale() // set greyscale
//             .write(`uploads/${fileName}`); // save
//             return fileName;
//           } else {
//             throw Error("Invalid image", { statusCode: 417 })
//           }
//       }).catch ((err) => {
//         const mssg = err.message;
//         throw Error(mssg)
//       });
//   } else {
//       throw Error("Image not valid, Please convert image to base64", { statusCode: 417 })
//   }
 
// }


