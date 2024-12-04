var express = require('express');
var router = express.Router();
var db = require("../db_module/module")

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
                if(data.length > 0){
                    console.log(data);
                    res.send(data);
                }
                else{
                    console.log("no result,", data);
                    res.status(500).send();
                }
            }
        }
    )
})

module.exports = router;