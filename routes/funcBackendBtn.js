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

router.post("/modifyProduct", (req, res) =>{
    console.log("receive productInfo:", req.body);
    const pNo = req.body.pNo;
    const pName = req.body.pName;
    const pIntroduction = req.body.pIntroduction;
    const unitPrice = req.body.unitPrice;
    const pAmount = req.body.pAmount;
    const sql = "UPDATE `product` SET `pNo`=?,`pName`=?,`pIntroduction`=?,`unitPrice`=?,`pAmount`=? WHERE pNo=?"
    db.connection.query(sql, [pNo, pName, pIntroduction, unitPrice, pAmount, pNo], (error, data) =>{
        if(error){
            console.log(error);
            res.status(500).send();
        }
        else{
            console.log(data);
            res.send(data);
        }
    })
    // res.send("OK")
})

router.get("/cleanCart", (req, res) =>{
    var sql = "DELETE FROM `cartdetail` WHERE 1"
    db.connection.query(sql, (error, data) =>{
        if(error){
            console.log(error);
            res.status(500).send();
        }
        else{
            sql = "DELETE FROM `cart` WHERE 1"
            db.connection.query(sql, (error, data) =>{
                if(error){
                    console.log(error);
                    res.status(500).send();
                }
                else{
                    console.log(data);
                    res.send(data);
                }
            })
        }
    })
})

router.get("/cleanTrans", (req, res) =>{
    var sql = "DELETE FROM `record` WHERE 1"
    db.connection.query(sql, (error, data) =>{
        if(error){
            console.log(error);
            res.status(500).send();
        }
        else{
            sql = "DELETE FROM `transaction` WHERE 1"
            db.connection.query(sql, (error, data) =>{
                if(error){
                    console.log(error);
                    res.status(500).send();
                }
                else{
                    console.log(data);
                    res.send(data);
                }
            })
        }
    })
})

module.exports = router;