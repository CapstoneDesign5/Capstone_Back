const router = require('express').Router();
const client = require('../db');

router.get('/list', (req,res)=> {
    client.query(
        "SELECT * FROM user ",(err, rows, fields)=> {
            res.send(rows);
        }
    )
});

router.post('/register', (req, res) => {
        let RRN = req.body["RRN"];
        let name = req.body.name;
        let address = req.body.address;
        let landline_phone = req.body.landline_phone;
        let phone_num = req.body.phone_num;
        let remark = req.body.remark;
        let manager_id = req.body.manager_id;

        if (!RRN && !address && !landline_phone && !phone_num && !remark){
            console.log(name);
            let sql = 'SELECT * FROM user WHERE name LIKE \'%' + name + '%\';';
            let params = [req.params.name];
            client.query(sql, function(error, rows, fields){
            if (error) throw error;
            console.log(rows);
            })

        }
        else{
            let f = req.body.flag;
            let sql = '';
            if (!f){
            sql = 'INSERT INTO user VALUES (?,?,?,?,?,?,?)';
            }
            else {
            sql = 'UPDATE user SET NAME = \''+name+'\' WHERE RRN = \'' + RRN + '\';';
            }

            let params = [RRN, name, address, landline_phone, phone_num, remark, manager_id];

            client.query(sql, params,
            (err,rows,fields) => {

                res.send(rows);
            }
            )
        }
});

router.delete('/:RRN',(req,res)=>{
        let sql = "DELETE FROM user WHERE RRN = ?";
        let params = [req.params.RRN];
        client.query(sql,params,
            (err,rows,fields)=>{
            res.send(rows);
        })
});

router.search('/Info', (req, res) => {
  let search_word = req.params.search_word;
  console.log(search_word);
})

module.exports = router;