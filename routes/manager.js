const router = require('express').Router();
const client = require('../db');

router.post('/login',(req,res)=>{
    const body = req.body;
    const id = body.id;
    const password = body.password;

    client.query('select * from manager where id=?',[id],(err,data)=>{ // data : 행
        if(data.length == 0) {
            console.log('아이디가 존재하지 않습니다.');
            res.sendStatus(401);
        }
        else if(id === data[0].id && password === data[0].password){
            console.log('로그인 성공');
            res.send(id);
            // 세션에 추가
            // req.session.is_logined = true;
            // req.session.UserId = id;
            // req.session.save(function(){ // 세션 스토어에 적용하는 작업
            //     console.log(req.session);
            // });
            // res.send(req.session);
        }else{
            console.log('비밀번호가 틀렸습니다.');
            res.sendStatus(401);
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
            const result = client.query('insert into manager(id, name, phone_num, e_mail, password) values(?,?,?,?,?)',[
                id, name, phone_num, e_mail, password
            ]);
            res.send('회원가입 성공');
        }else{
            console.log('회원가입 실패');
            res.send('회원가입에 실패하였습니다.');
        }
    });
});

router.get('/logout', (req, res)=>{
    // if(req.session.is_logined) {
    //     req.session.destroy(function(err){
    //         console.log('로그아웃');
    //     });
    //     res.send('로그아웃 성공');
    // }else {
    //     res.sendStatus(401);
    // }
});

//관리자 정보 가져오기
router.get('/Info/:id', (req,res)=> {
    const {id} = req.params;

    client.query(
        'select * from manager where id=?',[id],(err,data)=> {
            if(data.length == 0) {
                console.log('아이디가 존재하지 않습니다.');
                res.sendStatus(401);
            }else{
                res.json(data);
            }
    });
});

//비밀번호 변경
router.post('/password/:id', (req,res)=> {
    const body = req.body;
    const {id} = req.params;
    const newPassword = body.password;

    client.query(
        'select * from manager where id=?',[id],(err,data)=> {
            if(data.length == 0) {
                console.log('아이디가 존재하지 않습니다.');
                res.sendStatus(401);
            }else{
                const result = client.query('update manager set password=? where id=?',[newPassword, id]);
                console.log('비밀번호가 변경되었습니다.');
                res.send('비밀번호가 변경되었습니다.');
            }
    });
});

//관리자 정보 수정
router.post('/update/:id', (req,res)=> {
    const body = req.body;
    const {id} = req.params;
    const name = body.name;
    const phone_num = body.phone_num;
    const e_mail = body.e_mail;
    const newId = body.newId;

    if(id != newId) { //아이디 변경
        client.query(
            'select * from manager where id=?',[newId],(err,data)=> {
                if(data.length == 0) {
                    const result = client.query('update manager set id=?, name=?, phone_num=?, e_mail=? where id=?',[newId, name, phone_num, e_mail, id]);
                    console.log('관리자 정보가 변경되었습니다.');
                    res.send('관리자 정보가 변경되었습니다.');
                }else{
                    console.log('이미 존재하는 아이디입니다.');
                    res.send('이미 존재하는 아이디입니다.');
                    res.sendStatus(401);
                }
        });
    }else{ //아이디 그대로 유지
        client.query(
            'update manager set name=?, phone_num=?, e_mail=? where id=?',[name, phone_num, e_mail, id],(err,data)=> {
                if(data.length == 0) {
                    console.log('존재하지 않는 관리자 아이디입니다.');
                    res.send('존재하지 않는 관리자 아이디입니다.');
                    res.sendStatus(401);
                }else{
                    console.log('관리자 정보가 변경되었습니다.');
                    res.send('관리자 정보가 변경되었습니다.');
                }
        });
    }
});

module.exports = router;