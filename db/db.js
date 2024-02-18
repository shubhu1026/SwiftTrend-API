const mongoose = require("mongoose");

const config = require("../config/config");

const connectToDatabase = () => {
  mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true });
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
    console.log("Connected to Database");
  });
};

module.exports = connectToDatabase;
