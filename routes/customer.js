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

router.delete('/delete/:RRN',(req,res)=>{
        let sql = "DELETE FROM user WHERE RRN = ?";
        let params = [req.params.RRN];
        client.query(sql,params,
            (err,rows,fields)=>{
            res.send(rows);
        })
});

// router.search('/Info', (req, res) => {
//   let search_word = req.params.search_word;
//   console.log(search_word);
// })

//해당 사용자 정보 출력
router.post('/Info',(req,res)=>{
    const body = req.body;
    const RRN = body.RRN; //해당 사용자의 주민등록번호

    client.query('select * from user where RRN=?',[RRN],(err,data)=>{
        if(data.length == 0){ 
            console.log('회원 정보가 존재하지 않습니다.');
            res.sendStatus(401);
        }else{  
            res.json(data);
        }
    });
});

//사용자 정보 변경
router.post('/InfoUpdate/:RRN', (req,res)=> {
    const body = req.body;
    const {RRN} = req.params;
    const newName = body.name;
    const newAddress = body.address;
    const newLandlinePhone = body.landline_phone;
    const newPhoneNum = body.phone_num;
    const newRemark = body.remark;

    client.query(
        'select * from user where RRN=?',[RRN],(err,data)=> {
            if(data.length == 0) {
                console.log('해당 회원이 존재하지 않습니다.');
                res.sendStatus(401);
            }else{
                const result = client.query('update user set name=?, address=?, landline_phone=?, phone_num=?, remark=? where RRN=?',[newName, newAddress, newLandlinePhone, newPhoneNum, newRemark, RRN]);
                console.log('회원 정보가 변경되었습니다.');
                res.send('회원 정보가 변경되었습니다.');
            }
    });
});

module.exports = router;