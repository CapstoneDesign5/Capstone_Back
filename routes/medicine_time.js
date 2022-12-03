const router = require('express').Router();
const client = require('../db');

router.post('/input',(req,res)=>{
        const body = req.body;
        const RRN = body.RRN; //해당 사용자의 주민등록번호
        const time = body.time; //약 복용 시간
        const date = body.date; //약 복용 날짜
        const medicine = body.medicine; //복용해야 하는 약 이름

        client.query('select * from medicine_time where RRN=? and time=? and date=?',[RRN,time,date],(err,data)=>{
            if(data.length == 0){ 
                const result = client.query('insert into medicine_time(RRN, time, date, medicine) values(?,?,?,?)',[
                    RRN, time, date, medicine
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
            }else{  //중복된 데이터 값은 입력 불가
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

router.post('/lockCheck',(req,res)=>{
    const body = req.body;
    const lock_check = body.lock_check; 
    res.sendStatus(200);
    console.log(lock_check);
});

module.exports = router;