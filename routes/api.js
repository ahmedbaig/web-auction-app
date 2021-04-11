var express = require("express");
var app = express();

app.use("/item/admin", require('../app/http/controllers/api/item/admin'));

app.use("/item", require('../app/http/controllers/api/item'));

app.use("/bid", require('../app/http/controllers/api/bid'));

module.exports = app;