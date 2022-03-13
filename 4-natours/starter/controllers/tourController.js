const Tour = require("./../model/tourModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

exports.alias_top_tour = async (req, res, next) => {
    req.query.limit = "3";
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,price,ratingsAverage,summary,difficulty";
    next()
}

exports.get_all_tours = factory.get_all(Tour, "reviews");
exports.get_tour = factory.get_one(Tour, "reviews");
exports.create_tour = factory.create_one(Tour)
exports.update_tour = factory.update_one(Tour);
exports.delete_tour = factory.delete_one(Tour);

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

exports.get_tours_within = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(",");
    const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;
    
    if(!lat || !lng) next(new AppError("Please provide lat lng", 400))
    
    const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] }}});

    res.status(200).json({
        status: "success",
        result: tours.length,
        data: {
            data: tours
        }
    })
})

exports.get_distance = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(",");
    const multiplier = unit === "mi" ? 0.000621371 : 0.001;

    if(!lat || !lng) next(new AppError("Please provide lat lng", 400))

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [lng*1, lat*1]
                },
                distanceField: "distance",
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ]);
    
    res.status(200).json({
        status: "success",
        data: {
            data: distances
        }
    })
})