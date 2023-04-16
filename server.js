const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// process.on('uncaughtException', err=> {
//   console.log(err.name, err.message)
//   console.log('UNCAUGHT EXCEPTION shutting down')

 
//     process.exit(1)

// }) 


const app = require("./app");



const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`App running at port ${PORT}`);
});

// process.on('unhandledRejection', err => {
//   console.log(err.name, err.message)
//   console.log('UNHANDLE REJECTION shutting down')

//   // server.close(() => {
//   //   process.exit(1)
//   // })
// })

