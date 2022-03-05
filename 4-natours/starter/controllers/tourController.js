const Tour = require("./../model/tourModel");
const API_features = require("./../utils/apiFeatures");

exports.alias_top_tour = async (req, res, next) => {
    req.query.limit = "3";
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,price,ratingsAverage,summary,difficulty";
    next()
}

exports.get_all_tours = async (req, res) => {
    console.log(req.query)
    try {
        const features = new API_features(Tour.find(), req.query).filter().sort().limitFields().paginate();
        const tours = await features.db_query;

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
            runValidators: true
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


exports.get_tour_stats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: { $toUpper: "$difficulty" },
                    numTours: { $sum: 1 },
                    numRating: { $sum: "$ratingsQuantity" },
                    avgRating: { $avg: "$ratingsAverage" },
                    avgPrice: { $avg: "$price" },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" }
                }
            },
            {
                $sort: { avgPrice: 1 }
            },
            {
                $match: { _id: { $ne: "EASY" } }
            }
        ])

        res.status(200).json({
            status: "success",
            data: {
                stats
            }
        })        
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
}

exports.get_monthly_plan = async (req, res) => {
    try {
        const year = req.params.year * 1;

        const plan = await Tour.aggregate([
            {
                $unwind: "$startDates"
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$startDates" },
                    numTourStarts: { $sum: 1 },
                    tour: { $push: "$name" }
                }
            },
            {
                $addFields: { month: "$_id" }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numTourStarts: -1 }
            },
            {
                $limit: 12
            }
        ])

        res.status(200).json({
            status: "success",
            data: {
                plan
            }
        })        
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
}