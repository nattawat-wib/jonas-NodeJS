const fs = require("fs");
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, "utf-8"));

exports.check_id = (req, res, next, val) => {
    console.log(`tour id: ${val}`)

    if(val * 1 > tours.length) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        })
    }

    next()
}

exports.validate_tour = (req, res, next) => {
    if(!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: "error",
            msg: "tour must have name and price"
        })
    }

    next()
}

exports.get_all_tours = (req, res) => {
    res.status(200).json({
        status: "success",
        result: tours.length,
        data: {
            msg: tours
        }
    })
}

exports.get_tour = (req, res) => {
    const tour_id = req.params.id * 1;
    const tour = tours.find(tour => tour.id == tour_id)

    res.status(200).json({
        status: "success",
        data: {
            msg: tour
        }
    })
}

exports.create_tour = (req, res) => {
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

exports.update_tour = (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            msg: "Updaeted Tour"
        }
    })
}

exports.delete_tour = (req, res) => {
    res.status(404).json({
        status: "success",
        data: null
    })
}