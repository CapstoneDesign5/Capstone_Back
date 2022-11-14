const router = require('express').Router();
const client = require('../db');

router.post('/login',(req,res)=>{
    const body = req.body;
    const id = body.id;
    const password = body.password;

    client.query('select * from manager where id=?',[id],(err,data)=>{ // data : 행
        if(id === data[0].id && password === data[0].password){
            console.log('로그인 성공');
            // 세션에 추가
            req.session.is_logined = true;
            req.session.id = id;
            req.session.password = password;
            req.session.save(function(){ // 세션 스토어에 적용하는 작업
                console.log(req.session);
            });
            res.send(req.session);
        }else{
            console.log('로그인 실패');
        }
    });
});

router.post('/register',(req,res)=>{
    console.log('회원가입 하는중')
    const body = req.body;
    const id = body.id;
    const password = body.password;
    const name = body.name;
    const e_mail = body.e_mail;
    const phone_num = body.phone_num;

    client.query('select * from manager where id=?',[id],(err,data)=>{
        if(data.length == 0){ //중복되는 id가 없으면 가입 성공
            console.log('회원가입 성공');
            const result = client.query('insert into manager(id, name, phone_num, e_mail, password) values(?,?,?,?,?)',[
                id, name, phone_num, e_mail, password
            ]);
        }else{
            console.log('회원가입 실패');
            res.send('회원가입에 실패하였습니다.');
        }
    });
});

router.get('/logout', (req, res)=>{
    req.session.destroy(function(err){
        console.log('로그아웃');
    });
});

module.exports = router;