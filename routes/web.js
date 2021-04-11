"use strict";
var path = require("path");

module.exports = function(app) {
    app.get("/resources-images/:filename", function(req, res) {
        let filename = req.params.filename.replace(/\//g, '.')
        res.sendFile(
            path.join(ROOTPATH, "public/images", filename)
        );
    });
    app.get("/*", function(req, res) {
        res.render(path.join(ROOTPATH, "frontEnd/dist/AuctionApp"));
    });
};