const mongoose = require("mongoose");

const connect = () => {
    mongoose

        //  test:test id/pws @ ip

        .connect("mongodb://localhost:27017/nodejjang", {
            useNewUrlParser: true,
            useUnifiedTopology: true,

        })
        .catch((err) => console.log(err));
};

mongoose.connection.on("error", (err) => {
    console.error("mongoDB connection failed", err);
});

module.exports = connect;