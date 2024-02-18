const username = "swiftTrend";
const password = "swiftpassword";
const dbname = "Cluster0";

module.exports = {
  SERVER_NAME: "swift-trend-api",
  PORT: process.env.PORT || 5000,
  HOST: process.env.HOST || "127.0.0.1",
  MONGODB_URI: `mongodb+srv://${username}:${password}@cluster0.up9wkgf.mongodb.net/${dbname}?retryWrites=true&w=majority`,
};
