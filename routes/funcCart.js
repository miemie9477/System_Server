var express = require('express');
var router = express.Router();
var db = require("../db_module/module")
var cookieParser = require('cookie-parser');

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
    console.log("req:", req.body);
    const tId = req.cookies.tId;
    const pNo = req.body.info.pNo;
    const amount = req.body.info.amount;
    const cTotal = req.body.info.cTotal;
    sql = "UPDATE `cartdetail` SET `amount`='?',`cTotal`='?' WHERE tId=? AND pNo=?"
    db.connection.query(sql, [amount, cTotal, tId, pNo],
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
})

router.post("/discard", (req, res) =>{
    console.log("req:",req.body);
    const tId = req.cookies.tId;
    const pNo = req.body;
    const sql = "DELETE FROM `cartdetail` WHERE tId=? AND pNo=?"
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

function generateRId() {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const numbers = String(Math.floor(Math.random() * 10000000)).padStart(7, '0');
    const RId = letter + numbers;
    return RId;
}

async function getGenerateRId(){
    const id = generateRId();
    console.log("===Generating===");
    console.log("get RId:" + id);
    // Check if the generated ID is unique
    const query = 'SELECT * FROM transaction WHERE rId = ?';
    try {
        const data = await new Promise((resolve, reject) => {
            db.connection.query(query, [id], (error, results) => {
                if (error) {
                    console.log("wrong:", error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        if (data.length === 0) {
            console.log("confirm id:" + id);
            console.log("===End of Generating===");
            return id;
        } else {
            console.log("failed id:" + id);
            return getGenerateRId();  
        }
    }
    catch (error) {
        console.error('Database query failed:', error);
        throw error;
    } 
}

router.post("/sendTrans", (req, res) =>{
    if (req.cookies && req.cookies.rId) {
        // 清除 rId cookie
        res.clearCookie('rId', {
            path: '/', // 確保清除的 path 與設置時一致
        });
    } 
    const rId = generateRId();
    console.log(req.body);
    
    const total = req.body.total;
    const name = req.body.name;
    const phone = req.body.phone;
    
    const now = new Date(); // 當前 UTC 時間
    const taiwanTime = new Date(now.getTime() + 8 * 60 * 60 * 1000); // 加上 8 小時
    const isoString = taiwanTime.toISOString(); // 格式: 2024-11-28T08:25:32.123Z
    const tTime = isoString.replace(/T/, ' ').replace(/\.\d+Z$/, '');
    const payState = req.body.payState;
    const tState = req.body.tState;
    const tRemark = req.body.tRemark;

    const sql = "INSERT INTO `transaction`(`rId`, `total`, `name`, `phone`, `tTime`, `payState`, `tState`, `tRemark`) VALUES (?,?,?,?,?,?,?,?)"
    db.connection.query(sql, [rId, total, name, phone, tTime, payState, tState, tRemark], (error, data) =>{
        if(error){
            console.log(error);
            res.status(500).send(error);
        }
        else{
            console.log("data", data);
            res.cookie('rId', rId, {
                maxAge: 60 * 1000 * 15, // 15 分鐘有效期
                signed: false,
            });
            res.send(rId);
        }
    })
})

router.post("/sendRecord", (req, res) =>{
    console.log(req.body);
    const records = req.body;
    const rId = req.cookies.rId;
    const values = records.map(record => [
        rId,                    // 使用 cookie 中的 rId
        record.pNo || null,     // 商品編號
        record.pName || null,   // 商品名稱
        record.amount || null,  // 數量
        record.cTotal || null,  // 總價
        record.cSpicy || 0   // 辣度
    ]);
    
    const sql = "INSERT INTO record ( `rId`, `pNo`, `pName`, `rAmount`, `rTotal`, `rSpicy`) VALUES ?"
    db.connection.query(sql, [values], (error, data) =>{
        if(error){
            console.log(error);
            res.status(500).send({result: "Error", data, error});
        }
        else{
            const deletCart = "DELETE FROM `cartdetail` WHERE tId=?"
            db.connection.query(deletCart, [req.cookies.tId], (error, data) =>{
                if(error){
                    console.log(error);
                    res.status(500).send(error);
                }
                else{
                    console.log("data", data);
                    res.send(data);
                }
            })
        }
    })
})

router.get("/viewTrans", (req, res) =>{
    const rId = req.cookies.rId;
    const sql = "SELECT * FROM `transaction` WHERE rId =?";
    db.connection.query(sql, [rId], (error, data) =>{
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

router.get("/viewRecord", (req, res) =>{
    const rId = req.cookies.rId;
    const sql = "SELECT * FROM `record` WHERE rId =?";
    db.connection.query(sql, [rId], (error, data) =>{
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
