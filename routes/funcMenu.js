var express = require('express');
var router = express.Router();
var db = require("../db_module/module")

router.get("/loadMenu", (req, res) =>{
    const sql = "SELECT * FROM product"
    db.connection.query(sql, (error, data) =>{
        if(error){
            console.log(error);
            res.status(500).send({result: "Error", data, error});
        }
        else{
            // console.log(data);
            res.send(data);
        }
    })
})

module.exports = router;