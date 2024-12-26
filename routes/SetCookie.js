var express = require('express');
var router = express.Router();
var db = require('../db_module/module')

function generateTId() {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const numbers = String(Math.floor(Math.random() * 10000000)).padStart(7, '0');
    const tId = letter + numbers;
    return tId;
}

async function getGenerateTId(){
    const id = generateTId();
    console.log("===Generating===");
    console.log("get tId:" + id);
    // Check if the generated ID is unique
    const query = 'SELECT * FROM cart WHERE tId = ?';
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
            return getGenerateTId();  
        }
    }
    catch (error) {
        console.error('Database query failed:', error);
        throw error;
    } 
}



router.get('/createTId', async (req, res) =>{
    console.log("\n===Setting Cookie===")
    
    const tId = await getGenerateTId();
    console.log(`get ${tId}`);
    
    res.cookie('tId', tId, {
        maxAge: 60 * 1000 * 15, // 15 分鐘有效期
        signed: false,
    });
    const now = new Date(); // 當前 UTC 時間
    const taiwanTime = new Date(now.getTime() + 8 * 60 * 60 * 1000); // 加上 8 小時
    const isoString = taiwanTime.toISOString(); // 格式: 2024-11-28T08:25:32.123Z
    const tTime = isoString.replace(/T/, ' ').replace(/\.\d+Z$/, '');
    const query = 'INSERT INTO `cart`(`tId`, `cTime`) VALUES (?, ?)'
    db.connection.query(query, [tId, tTime], (error, data) =>{
        console.log(data);
        if(error){
            console.log(error);
            res.status(500).send({result: "Error", data, error});
        }
        else{
            console.log(data);
            console.log("===Finish Setting===")
            return res.send({result: "新增成功", data});
        }
    })
})


router.get("/checkCookie", (req, res) =>{
    console.log("\ncheck:", req.cookies.tId);
    res.send({result: req.cookies.tId});
})




module.exports = router;