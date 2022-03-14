class API_features {
    constructor(db_query, query_string) {
        this.db_query = db_query;
        this.query_string = query_string;
    }

    filter() {
        // 1ฺ.1) Filtering
        const queryObj = {...this.query_string};
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach(el => delete queryObj[el])

        // 1.2) Advance Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

        this.db_query = this.db_query.find(JSON.parse(queryStr))

        return this;
    }

    sort() {
        if(this.query_string.sort) {
            const sortBy = this.query_string.sort.split(",").join(" ")
            this.db_query = this.db_query.sort(sortBy)
        } else {
            this.db_query = this.db_query.sort("-createdAt")
        }

        return this;
    }

    limitFields() {
        if(this.query_string.fields) {
            const fields = this.query_string.fields.split(",").join(" ");
            this.db_query = this.db_query.select(fields)
        } else {
            this.db_query = this.db_query.select("-__v")
        }

        return this;
    }

    paginate() {
        const page = this.query_string.page * 1;
        const limit = this.query_string.limit * 1;
        const skip = (page - 1) * limit;
        this.db_query = this.db_query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = API_features;