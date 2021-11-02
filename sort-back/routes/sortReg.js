const express = require("express");
const SortController = require("../controllers/sortReg");
 
const api = express.Router();



api.get("/sort-reg", SortController.getSort);

api.post('/sort-reg', SortController.postSort);


module.exports = api;
