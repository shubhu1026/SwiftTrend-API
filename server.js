const restify = require("restify");
const config = require("./config/config");
const configureRoutes = require("./routes/routes");
const connectToDatabase = require("./db/db");

const server = restify.createServer({ name: config.SERVER_NAME });

server.use(restify.plugins.queryParser());
server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

connectToDatabase();

configureRoutes(server);

server.listen(config.PORT, config.HOST, () => {
  console.log("Server %s listening at %s", server.name, server.url);
});
