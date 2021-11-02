const mongoose = require("mongoose");

const moment = require("moment");
require("moment/locale/es");

const app = require("./app");

const { API_VERSION, IP_SERVER, PORT_DB } = require("./config");

const server = require("http").createServer(app);

const port = process.env.PORT || 8080;

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.connect(`mongodb://${IP_SERVER}:${PORT_DB}/sort_fanta`, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
	if (err) {
		throw err;
	} else {
		server.listen(port, function () {
			console.log("--------------------------------");
			console.log("|          Sort Fanta          |");
			console.log("--------------------------------");
			console.log(`http://${IP_SERVER}:${port}/api/${API_VERSION}`);
		});
	}
});
