const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 
const sortRegSchema = Schema({
	n_sort : {type:Number, required:true}, 
    winner: {type: String, default:''},
    requirements:{type: Boolean, default: false},
    phone: {type:Number, default:0},
    time_sort: {type:String, default:0}
});

module.exports = mongoose.model("SortRegion", sortRegSchema);
