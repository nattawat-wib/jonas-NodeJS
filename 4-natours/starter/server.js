const mongoose = require("mongoose");
const dotenv = require("dotenv");

// process.on("uncaughtException", err => {
//     console.log("Uncaught Exception!!!! server is shutting down")
//     console.log(err.name, err.message);
//     process.exit(1)
// })

dotenv.config({path: "./config.env"})
const app = require("./app");

// CONTENT MONGO ATLAS
const DB = process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD)
const DB_local = process.env.DATABASE_LOCAL

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log("DB connection successfully"))

// CREATE SERVER
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})

// process.on("unhandledRejection", err => {
//     console.log("Unhandled Rejection!!!! server is shutting down")
//     console.log(err.name, err.message);
//     server.close(() => {
//         process.exit(1)
//     })
// })