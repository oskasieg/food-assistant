const mongoose = require("mongoose");
const options = require("../config");

const connect = (url = options.dbUrl, opts = {}) => {
  return mongoose.connect(url, {
    ...opts,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
};

const close = () => {
  return mongoose.connection.close();
};

module.exports = { close, connect };
