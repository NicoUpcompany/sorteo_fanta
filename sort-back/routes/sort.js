const express = require("express");
const SortController = require("../controllers/sort");
 
const api = express.Router();



api.get("/sort", SortController.getSort);

api.post('/sort', SortController.postSort);


module.exports = api;
