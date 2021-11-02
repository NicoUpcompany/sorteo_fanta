const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const { API_VERSION } = require("./config");

const sortRoutes = require("./routes/sort");
const sortRegRoutes = require("./routes/sortReg");

// app.use(express.urlencoded());
app.use(express.json());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
	);
	res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
	res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
	next();
});

app.use(`/api/${API_VERSION}`,sortRoutes );
app.use(`/api/${API_VERSION}`, sortRegRoutes);


module.exports = app;
