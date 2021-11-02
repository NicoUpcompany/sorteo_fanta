require("dotenv").config();
const moment = require("moment");
const momentTimezone = require("moment-timezone");
require("moment/locale/es");
const Sort = require("../models/sortReg");



function getSort(req, res) {
	Sort.find({})
		.exec((err, sortStored) => {
			if (err) {
				console.log(err);
				res.status(500).send({ ok: false, message: "Error del servidor" });
			} else {
				if (!sortStored) {
					res.status(404).send({ ok: false, sort: [] })
				} else {
					res.status(200).send({ ok: true, sort: sortStored })
				}
			}
		})
}

async function postSort(req, res) {

	const { n_sort, winner, requirements, phone } = req.body;
	const sort = new Sort();
	const time = moment().format();
	const sortTime = momentTimezone.tz(time, "America/Santiago");
	sort.n_sort = n_sort; 
	sort.winner = winner;
	sort.requirements = requirements;
	sort.phone = phone;
	sort.time_sort = sortTime;


	sort.save((err, sortStored) =>{
		if(err){
			console.log(err);
			res.status(500).send({ok:false, message: "Error al guardar el sorteo"})
		}else{
			if(!sortStored){
				res.status(404).send({ok:false, message:"Error al guardar el sorteo"})
			}else{
				res.status(200).send({
					ok:true,
					message:"Sorteo guardado"
				})
			}
		}
	})
	
}

module.exports = {
	getSort,
	postSort
};
