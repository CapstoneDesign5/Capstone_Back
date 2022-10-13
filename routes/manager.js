const router = require('express').Router();
const mysql = require('mysql');
// db 연결 2
const client = mysql.createConnection({
    host : '127.0.0.1',
    port : 3306,
    user : 'capstone',
    password : '1234',
    database : 'capstone_design'
});

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

    client.query('select * from userdata where id=?',[id],(err,data)=>{
        if(data == null){
            console.log('회원가입 성공');
            client.query('insert into manager(id, name, phone_num, e_mail, password) values(?,?,?,?,?)',[
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