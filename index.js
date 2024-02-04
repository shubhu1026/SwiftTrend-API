const SERVER_NAME = "swift-trend-api";
const PORT = 5000;
const HOST = "127.0.0.1";

const mongoose = require("mongoose");
const restify = require("restify");
const errors = require("restify-errors");
const userRoutes = require("./UserRoutes");

const username = "swiftTrend";
const password = "swiftpassword";
const dbname = "Cluster0";

const uristring = `mongodb+srv://${username}:${password}@cluster0.up9wkgf.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(uristring, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to Database");
});

const server = restify.createServer({ name: SERVER_NAME });

server.listen(PORT, HOST, () => {
  console.log("Server %s listening at %s", server.name, server.url);
});

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

server.get("/home", (req, res, next) => {
  try {
    res.send(200, "Server is up and running!");
    return next();
  } catch (error) {
    console.error("Error in handling the request:", error);
    return next(new errors.InternalServerError("Internal Server Error"));
  }
});

server.get("/users", userRoutes.getAllUsers);
server.post("/signup", userRoutes.signup);
server.post("/login", userRoutes.login);
