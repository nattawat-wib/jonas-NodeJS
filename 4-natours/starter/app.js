const express = require("express");
const fs = require("fs");
const morgan = require("morgan");

const app = express();
const port = 3000;

// 1) MIDDLEQARE
app.use(morgan("tiny"))
app.use(express.json()); 
app.use((req, res, next) => {
    console.log("test mdw")
    next()
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next()
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, "utf-8"));

// 2) ROUTE HANDLER
const get_all_tours = (req, res) => {
    res.status(200).json({
        status: "success",
        result: tours.length,
        data: {
            msg: tours
        }
    })
}

const get_tour = (req, res) => {
    const tour_id = req.params.id * 1;
    let tour = tours.find(tour => tour.id == tour_id)

    if(tour_id > tours.length) {
        res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        })
    }

    res.status(200).json({
        status: "success",
        data: {
            msg: tour
        }
    })
}

const create_tour = (req, res) => {
    const new_id = tours[tours.length - 1].id + 1;
    const new_tour = Object.assign({id: new_id}, req.body)

    tours.push(new_tour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: "success",
            data: {
                tour: new_tour
            }
        })
    })
}

const update_tour = (req, res) => {
    if(req.params.id * 1 > tours.length) {
        res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        })
    }

    res.status(200).json({
        status: "success",
        data: {
            msg: "Updaeted Tour"
        }
    })
}

const delete_tour = (req, res) => {
    if(req.params.id * 1 > tours.length) {
        res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        })
    }

    res.status(404).json({
        status: "success",
        data: null
    })
}

const get_all_users = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "this route not yet defind"
    })
}

const create_user = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "this route not yet defind"
    })
}

const get_user = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "this route not yet defind"
    })
}

const update_user = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "this route not yet defind"
    })
}

const delete_user = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "this route not yet defind"
    })
}

// 3) ROUTE
app
    .route("/api/v1/tours")
    .get(get_all_tours)
    .post(create_tour)

app
    .route("/api/v1/tours/:id")
    .get(get_tour)
    .patch(update_tour)
    .delete(delete_tour)

app
    .route("/api/v1/users")
    .get(get_all_users)
    .post(create_user)

app
    .route("/api/v1/user/:id")
    .get(get_user)
    .patch(update_user)
    .delete(delete_user)

// 4) SERVER
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})