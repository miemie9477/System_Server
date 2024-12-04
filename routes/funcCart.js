var express = require('express');
var router = express.Router();
var db = require("../db_module/module")

router.post("/addCart", (req, res) =>{
    var info={
        tId: req.cookies.tId,
        pNo: req.body.pNo,
        pName: req.body.pName,
        amount:req.body.amount,
        cTotal:req.body.cTotal,
        cSpicy:req.body.cSpicy
    }
    console.log(req.body);
    const sql = "INSERT INTO cartdetail ( `tId`, `pNo`, `pName`, `amount`, `cTotal`, `cSpicy`) VALUES (?,?,?,?,?,?)"
    db.connection.query(sql, [info.tId, info.pNo, info.pName, info.amount, info.cTotal, info.cSpicy], (error, data) =>{
        if(error){
            console.log(error);
            res.status(500).send({result: "Error", data, error});
        }
        else{
            console.log(data);
            res.send(data);
        }
    })
})

router.get("/checkCart", (req, res) =>{
      const tId = req.cookies.tId;
      console.log(`tId: ${tId}`);
      const sql = "SELECT * FROM `cartdetail` WHERE `tId`=?"
      db.connection.query(sql, [tId], (error, data) =>{
            if(error){
                console.log(error);
                res.status(500).send({result: "Error", data, error});
            }
            else{
                console.log(data);
                res.send(data);
            }
      })
})      

router.post("/modifyAmount", async (req, res) =>{
    const tId = req.cookies.tId;
    const pNo = req.body.pNo;
    const amount = req.body.amount;
    const cTotal = req.body.cTotal;
    const cSpicy = req.body.cSpicy;
    var sql = "SELECT unitPrice FROM 00product WHERE pNo=?"
    await db.connection.query(sql, [pNo],
        (error, data) =>{
            if(error){
                console.log(error);
                res.status(500).send({result: "Error", data, error});
            }
            else{
                console.log("unitPrice", data[0].unitPrice)
                salePrice = parseInt(data[0].unitPrice, 10) * amount;
                console.log("salePrice:", salePrice);
                
                sql = "UPDATE `00cartdetail` SET `amount`='?',`salePrice`='?' WHERE tId=? AND pNo=?"
                db.connection.query(sql, [amount, salePrice, tId, pNo],
                    (error, data) =>{
                        if(error){
                            console.log(error);
                            res.status(500).send(error);
                        }
                        else{
                            res.send({result: "success", data});
                        }
                    }
                )
            }
        }
    )
    
})

router.post("/discard", (req, res) =>{
    const tId = req.cookies.tId;
    const pNo = req.body.pNo;
    const sql = "DELETE FROM `cart` WHERE tId=? AND pNo=?"
    db.connection.query(sql, [tId, pNo], (error, data) =>{
        if(error){
            console.log(error);
            res.status(500).send(error);
        }
        else{
            console.log("data", data);
            res.send(data);
        }
    })
})  

module.exports = router;
