const Tour = require("./../model/tourModel");
const API_features = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.alias_top_tour = async (req, res, next) => {
    req.query.limit = "3";
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,price,ratingsAverage,summary,difficulty";
    next()
}

exports.get_all_tours = catchAsync(async (req, res, next) => {
    const features = new API_features(Tour.find(), req.query).filter().sort().limitFields().paginate();
    const tours = await features.db_query;

    res.status(200).json({
        status: "success",
        result: tours.length,
        data: {
            msg: tours
        }
    })
})

exports.get_tour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id).populate("reviews");

    if(!tour) return next(new AppError("No tour found with that ID", 404))

    res.status(200).json({  
        status: "success",
        data: {
            msg: tour
        }
    })
})

exports.create_tour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            tour: newTour
        }
    })
});

exports.update_tour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!tour) return next(new AppError("No tour found with that ID", 404))

    res.status(200).json({
        status: "success",
        data: {
            msg: tour
        }
    })
})

exports.delete_tour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    
    if(!tour) return next(new AppError("No tour found with that ID", 404))

    res.status(200).json({
        status: "success",
        data: {
            msg: tour
        }
    })  
})


exports.get_tour_stats = catchAsync(async (req, res, next) => {
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
})

exports.get_monthly_plan = catchAsync(async (req, res, next) => {
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
})