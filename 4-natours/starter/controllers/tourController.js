const Tour = require("./../model/tourModel");

exports.get_all_tours = async (req, res) => {
    console.log(req.query)
    try {
        // 1) Filtering
        const queryObj = {...req.query};
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach(el => delete queryObj[el])
        
        // 2) Advance Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

        const tours = await Tour.find(JSON.parse(queryStr))
    
        res.status(200).json({
            status: "success",
            result: tours.length,
            data: {
                msg: tours
            }
        })
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        })
    }

}

exports.get_tour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id)

        res.status(200).json({
            status: "success",
            data: {
                msg: tour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: "Tour not found"
        })
    }
}

exports.create_tour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
}

exports.update_tour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidate: true
        });
    
        res.status(200).json({
            status: "success",
            data: {
                msg: tour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
}

exports.delete_tour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);
    
        res.status(200).json({
            status: "success",
            data: {
                msg: tour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        })
    }    
}