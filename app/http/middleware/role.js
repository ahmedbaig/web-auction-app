"use strict";
var compose = require("composable-middleware");
//Super Admin
function checkAdmin() {
    return (
        compose()
        // Attach user to request
        .use(async function(req, res, next) {
            let token = req.headers['x-access-token'] || req.headers['authorization'];
            if (!token)
                return res.status(401).send({
                    success: false,
                    msg: "Access Denied. No token provided.",
                    code: 401,
                });
            // Remove Bearer from string
            token = token.replace(/^Bearer\s+/, ""); 
            if (token == "I AM ADMIN") {
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