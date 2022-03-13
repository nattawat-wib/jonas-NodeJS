const catchAsync = require("./../utils/catchAsync")
const AppError = require("./../utils/appError")
const API_features = require("./../utils/apifeatures");

exports.get_all = Model => catchAsync(async (req, res, next) => {
    // to allow nested get review on tour
    let filter = {}
    if(req.params.tour_id) filter = { tour: req.params.tour_id }

    const features = new API_features(Model.find(filter), req.query).filter().sort().limitFields().paginate();
    // const docs = await features.db_query.explain();
    const docs = await features.db_query;

    res.status(200).json({
        status: "success",
        result: docs.length,
        data: {
            data: docs
        }
    })
})

exports.get_one = (Model, populateOption) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id)
    if(populateOption) query = query.populate(populateOption)
    const doc = await query;

    if(!doc) return next(new AppError("No document found with that ID", 404))

    res.status(200).json({  
        status: "success",
        data: {
            data: doc
        }
    })
})

exports.create_one = Model => catchAsync(async (req, res) => {
    const doc = await Model.create(req.body);

    res.status(500).json({
        status: "success",
        data: {
            data: doc
        }
    })
})

exports.update_one = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!doc) return next(new AppError("No document found with that ID", 404))

    res.status(200).json({
        status: "success",
        data: {
            data: doc
        }
    })
})

exports.delete_one = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    
    if(!doc) return next(new AppError("No document found with that ID", 404))

    res.status(200).json({
        status: "success",
        message: "document delete successfully"
    })  
})
