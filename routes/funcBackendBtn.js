var express = require('express');
var router = express.Router();
var db = require("../db_module/module");

router.post("/payBill", (req, res) =>{
    const sql = "UPDATE `transaction` SET `payState`=1 WHERE rId=?;"
    const rId = req.body.orderNum;
    db.connection.query(sql, [rId],(error, data) =>{
        if(error){
            console.log(error);
            res.status(500).send();
        }
        else{
            console.log(data);
            res.send(data);
        }
    })
})

router.post("/deliver", (req, res) =>{
    const sql = "UPDATE `transaction` SET `tState`=1 WHERE rId=?;"
    const rId = req.body.orderNum;
    db.connection.query(sql, [rId],(error, data) =>{
        if(error){
            console.log(error);
            res.status(500).send();
        }
        else{
            console.log(data);
            res.send(data);
        }
    })
})

router.post("/refund", (req, res) =>{
    const sql = "UPDATE `transaction` SET `payState`=-1 WHERE rId=?;"
    const rId = req.body.orderNum;
    db.connection.query(sql, [rId],(error, data) =>{
        if(error){
            console.log(error);
            res.status(500).send();
        }
        else{
            console.log(data);
            res.send(data);
        }
    })
})

router.post("/delete", (req, res) =>{
    const sql = "DELETE FROM `transaction` WHERE rId=?;" //Turn on foreign key
    const rId = req.body.orderNum;
    db.connection.query(sql, [rId],(error, data) =>{
        if(error){
            console.log(error);
            res.status(500).send();
        }
        else{
            console.log(data);
            res.send(data);
        }
    })
})

module.exports = router;