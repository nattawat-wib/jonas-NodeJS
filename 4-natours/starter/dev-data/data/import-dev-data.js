const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require(`${__dirname}/../../model/tourModel`);

dotenv.config({path: `${__dirname}/../../config.env`})

// CONTENT MONGO ATLAS
const DB = process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD)
const DB_local = process.env.DATABASE_LOCAL

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log("DB connection succesfully"))

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8"));

const import_data = async () => {
    try {
        await Tour.create(tours);
        console.log("DB successfully loaded")

    } catch(err) {
        console.log(err)
    }
    process.exit()
}

const delete_data = async () => {
    try {
        await Tour.deleteMany();
        console.log("DB successfully deleted")

    } catch(err) {
        console.log(err)
    }
    process.exit()
}

if(process.argv[2] === "--import") {
    import_data()
} else if (process.argv[2] === "--delete") {
    delete_data()
}