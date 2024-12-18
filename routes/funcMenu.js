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

router.post('/loadGood', (req, res) =>{
    const pNo = req.body.pNo;
    console.log("\n===loading good===\nget pNo:" + pNo);
    const sql = "SELECT * FROM product WHERE pNo=?";
    db.connection.query(sql, [pNo],
        (error, data) =>{
            if(error){
                console.log(error);
                res.status(500).send({result: "Error", data, error});
            }
            else{
                // console.log(data);
                res.send(data);
            }
        }
    )
})

module.exports = router;