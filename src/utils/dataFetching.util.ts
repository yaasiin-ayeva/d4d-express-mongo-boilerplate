import mongoose from "mongoose";


/**
 * Fetches datatable data for a given model.
 * It helps to render an Ajax Jquery datatable on the client side.
 *
 * @param {object} p - The input object.
 * @param {object} p.req - The request object.
 * @param {number} p.req.body.draw - The draw number.
 * @param {number} p.req.body.start - The start index.
 * @param {number} p.req.body.length - The length of data to fetch.
 * @param {string} p.req.body.search.value - The search value.
 * @param {object} p.req.body.order - The order object.
 * @param {number} p.req.body.order.column - The column index.
 * @param {string} p.columns - The columns array.
 * @param {string} p.columns[n] - The column name.
 * @param {string} p.req.body.order.dir - The order direction.
 * @param {function} p.search_filter - The search filter function.
 * @param {string} p.model - The model name.
 * @return {object} The fetched datatable data.
 */
const fetch_datatable_data = async (p) => {

    const draw = parseInt(p.req.body.draw);
    const start = parseInt(p.req.body.start);
    const length = parseInt(p.req.body.length);
    const searchValue = p.req.body?.search?.value;
    const order = p.req.body?.order;
    const orderColumnName = p.columns[parseInt(order.column)];
    const orderDir = order.dir;

    const build_pipeline = (pipeline_name) => {
        if (p[pipeline_name] === undefined) {
            p[pipeline_name] = [];
        } else if (
            Object.prototype.toString.call(p[pipeline_name]) === "[object Object]"
        ) {
            p[pipeline_name] = [
                {
                    $match: p[pipeline_name],
                },
            ];
        }
    };

    const exec_pipeline = async (pipeline) => {
        let data = null;

        if (typeof p.model === "string") {
            data = await mongoose.connection
                .collection(p.model)
                .aggregate(pipeline)
                .toArray();
        } else {
            data = await p.model.aggregate(pipeline);
        }

        return data;
    };

    build_pipeline("total_pipeline");

    p.total_pipeline.push({ $count: "total" });

    let data = await exec_pipeline(p.total_pipeline);

    let recordsTotal = data[0]?.total ?? 0;
    let recordsFiltered = recordsTotal;

    // Filter by search value
    build_pipeline("data_pipeline");

    if (searchValue) {
        p.data_pipeline.push({
            $match: {
                $or: p.search_filter(searchValue),
            },
        });

        let ppl = [...p.data_pipeline];

        ppl.push({ $count: "total" });

        data = await exec_pipeline(ppl);

        recordsFiltered = data[0]?.total ?? 0;
    }

    p.data_pipeline.push(
        { $sort: { [orderColumnName]: orderDir == "asc" ? 1 : -1 } },
        { $skip: start }
    );

    if (length > -1) {
        p.data_pipeline.push({ $limit: length });
    }

    data = await exec_pipeline(p.data_pipeline);

    data = data.map(async (obj, ind) => {
        obj.__no__ =
            orderDir == "asc" ? start + ind + 1 : recordsFiltered - start - ind;

        if (p.callback) {
            await p.callback(obj);
        }

        return obj;
    });

    data = await Promise.all(data);

    return { draw, recordsTotal, recordsFiltered, data };
};

export {
    fetch_datatable_data,
}