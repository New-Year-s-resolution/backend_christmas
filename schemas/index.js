const mongoose = require("mongoose");
require('dotenv').config();

const connect = () => {
    mongoose
        .connect(`mongodb://${process.env.MONGO_URL}/${process.env.MONGO_DB}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            user: process.env.MONGO_USER,
		    pass: process.env.MONGO_PASS
        })
        .catch((err) => console.log(err));
};

mongoose.connection.on("error", (err) => {
    console.error("mongoDB connection failed", err);
});

module.exports = connect;