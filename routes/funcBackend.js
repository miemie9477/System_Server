var express = require('express');
var router = express.Router();
var db = require("../db_module/module");
var cookieParser = require('cookie-parser');

router.get("/member", (req, res) =>{
    const sql = "SELECT * FROM `member` WHERE 1"
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
})

router.post("/insertMember", (req, res)=>{
    const account = req.body.account;
    const pwd = req.body.pwd;
    const sql = "INSERT INTO `member`(`account`, `pwd`) VALUES (?,?)"
    db.connection.query(sql, [account, pwd], (err, data) => {
        if (err) {
            console.error('Error:', err);
            return;
        }
        else{
            console.log("login:", data);
            res.send(data);
        }
    });
})

router.post("/modifyMember", (req, res) =>{
    const account = req.body.account;
    const pwd = req.body.pwd;
    const sql = "UPDATE `member` SET `account`=?,`pwd`=? WHERE `account`=?"
    db.connection.query(sql, [account, pwd, account], (err, data) => {
        if (err) {
            console.error('Error:', err);
            return;
        }
        else{
            console.log("login:", data);
            res.send(data);
        }
    });
})

router.post("/deleteMember", (req, res) =>{
    const account = req.body.account;
    const sql = "DELETE FROM `member` WHERE account=?"
    db.connection.query(sql, [account], (err, data) => {
        if (err) {
            console.error('Error:', err);
            return;
        }
        else{
            console.log("login:", data);
            res.send(data);
        }
    });
})

router.post("/login", (req, res) =>{
    const account = req.body.account;
    const password = req.body.pwd;

    const query = "SELECT * FROM `member` WHERE BINARY `account` = ? AND BINARY `pwd` = ?;";
    db.connection.query(query, [account, password], (err, data) => {
        if (err) {
            console.error('Error:', err);
            return;
        }
        else{
            console.log("login:", data);
            res.send(data);
        }
    });
})


router.get("/allTrans", (req, res) =>{
    const sql = "SELECT * FROM `transaction` WHERE 1;"
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
})
router.get("/allTransDetail", (req, res) =>{
    const sql = "SELECT * FROM `record`"
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
})

router.get("/checkPay", (req, res)=>{
    const sql = "SELECT * FROM `transaction` WHERE `payState` = 0;"
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
})

router.get("/checkPayDetail", (req, res) =>{
    const sql = "SELECT r.* FROM record r JOIN transaction t ON r.rId = t.rId WHERE t.payState = 0;"
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
})

router.get("/ready", (req, res) =>{
    const sql = "SELECT * FROM `transaction` WHERE `payState`=1 AND `tState`=0;"
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
})

router.get("/readyDetail", (req, res) =>{
    const sql = "SELECT `record`.* FROM `transaction` INNER JOIN `record` ON `transaction`.`rId` = `record`.`rId` WHERE `transaction`.`payState`= 1 AND `transaction`.`tState`=0;"
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
})

router.get("/done", (req, res) =>{
    const sql = "SELECT * FROM `transaction`  WHERE `payState`= 1 AND `tState`=1;"
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
})
router.get("/doneDetail", (req, res) =>{
    const sql = "SELECT `record`.* FROM `transaction` INNER JOIN `record` ON `transaction`.`rId` = `record`.`rId` WHERE `transaction`.`payState`= 1 AND `transaction`.`tState`=1;"
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
})



module.exports = router;