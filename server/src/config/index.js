const baseConfig = {
  port: 8001,
  dbUrl:
    "mongodb+srv://admin:admin@cluster0.onmgs.mongodb.net/seminarium?retryWrites=true&w=majority",
  secrets: {
    jwt: "learneverything",
    jwtExp: "100d",
  },
};

module.exports = baseConfig;

// local database
// "mongodb://localhost:27017/server"

// mongo atlas
// "mongodb+srv://admin:admin@cluster0.onmgs.mongodb.net/seminarium?retryWrites=true&w=majority"
