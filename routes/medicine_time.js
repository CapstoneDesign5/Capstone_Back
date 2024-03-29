const router = require('express').Router();
const client = require('../db');


router.post('/input',(req,res)=>{
        const body = req.body;
        const RRN = body.RRN; //해당 사용자의 주민등록번호
        const time = body.time; //약 복용 시간
        const date = body.date; //약 복용 날짜
        const medicine = body.medicine; //복용해야 하는 약 이름
        const medicine_check = body.medicine_check;

        client.query('select * from medicine_time where RRN=? and time=? and date=?',[RRN,time,date],(err,data)=>{
            if(data.length == 0){ 
                const result = client.query('insert into medicine_time(RRN, time, date, medicine, medicine_check) values(?,?,?,?,?)',[
                    RRN, time, date, medicine, medicine_check
                ]);
                console.log('복용 시간이 입력되었습니다.');
                res.send('복용 시간이 입력되었습니다.');
            }else{  //중복된 데이터 값은 입력 불가
                console.log('복용 시간 입력 실패');
                res.send('복용 시간 입력에 실패하였습니다.');
            }
        });
});

router.post('/delete',(req,res)=>{
        const body = req.body;
        const RRN = body.RRN; //해당 사용자의 주민등록번호
        const time = body.time; //약 복용 시간
        const date = body.date; //약 복용 날짜

        client.query('select * from medicine_time where RRN=? and time=? and date=?',[RRN,time,date],(err,data)=>{
            if(data.length != 0){ 
                console.log('복용 시간이 삭제되었습니다.');
                client.query('delete from medicine_time where RRN=? and time=? and date=?',[
                    RRN, time, date
                ]);
                res.sendStatus(200);
            }else{  
                console.log('데이터를 찾지 못했습니다.');
                res.send('데이터를 찾지 못했습니다.');
            }
        });
});

router.get('/list', (req,res)=>{
        client.query('select * from medicine_time',(err,data)=>{
            res.json(data);
        })
});

let lock_check = "";

router.post('/lockCheck',(req,res)=>{
    const body = req.body;
    lock_check = body.lock_check; 
    console.log(lock_check);
    res.sendStatus(200);
});

router.get('/lockCheck/get',(req,res)=>{
    res.send(lock_check);
});

router.post('/lockCheck/post',(req,res)=>{
    const body = req.body;
    const RRN = body.RRN; 
    const time = body.time; 
    const date = body.date; 

    const check = "복용";

    client.query(
        'select * from medicine_time where RRN=? and time=? and date=?',[RRN,time,date],(err,data)=> {
            if(data.length == 0) {
                console.log('잘못된 값입니다.');
                res.sendStatus(401);
            }else{
                const result = client.query('update medicine_time set medicine_check = ? where RRN=? and time=? and date=?',[check, RRN, time, date]);
                console.log('약을 복용하였습니다.');
                res.sendStatus(200);
            }
    });
});


module.exports = router;