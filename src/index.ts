import express from 'express';
import bodyParser from 'body-parser';
import config from 'configuration-master';
config.loadConfig("../configuration.json", null);

const DEFAULT_PORT = 9999;
const port = process.env.PORT || DEFAULT_PORT;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use("/api/fail", (req, res, next) =>
{
	res.status(403).send("Unauthorized");
});

// grab handle to logger
const { logger } = require("./routes/logging");

// server api requests
app.use("/", require("./routes").router);

// testing
app.use("/status", (req, res, next) =>
{
	res.send({ service: "working as expected" });
});

console.log("about to listen: ", port);
// start server
app.listen(port, () =>
{
	logger.info(`To view your app, open this link in your browser: http://localhost:${port}`);
});
