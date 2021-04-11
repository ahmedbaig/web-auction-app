"use strict";
var compose = require("composable-middleware");
//Super Admin
function checkAdmin() {
    return (
        compose()
        // Attach user to request
        .use(async function(req, res, next) {
            if (req.header.authorization == "I AM ADMIN") {
                next();
            } else {
                var errors = {
                    success: false,
                    msg: "You're not an admin"
                };
                res.status(400).send(errors);
                return;
            }
        })
    );
};

exports.checkAdmin = checkAdmin;