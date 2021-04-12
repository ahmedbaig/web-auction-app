"use strict";

const _ = require("lodash");
const ItemService = require("../../../services/item.service")

exports.create = function (req, res) {
    try {
        if (!req.files) {
            res
                .status(200)
                .send({ success: false, msg: "No Media file exists!", data: null });
            return;
        } else { 
            const image = req.files.image[0]; 
            const { path,originalname } = image;  
            req.body.image = `${originalname}`; 
            ItemService.create(req.body)
                .then(item => {
                    res.send({
                        success: true,
                        item
                    })
                })
                .catch(error => {
                    res.status(400).send({ success: false, msg: error.message });
                })
        }
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
}