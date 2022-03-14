const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require(`${__dirname}/../../model/tourModel`);
const User = require(`${__dirname}/../../model/userModel`);
const Review = require(`${__dirname}/../../model/reviewModel`);

dotenv.config({path: `${__dirname}/../../config.env`})

// CONTENT MONGO ATLAS
const DB = process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD)
const DB_local = process.env.DATABASE_LOCAL

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log("DB connection successfully"))

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, "utf-8"));

const import_data = async () => {
    try {
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);
        console.log("DB successfully loaded")

    } catch(err) {
        console.log(err)
    }
    process.exit()
}

const delete_data = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
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