const router = require('express').Router();
const client = require('../db');

router.post('/input',(req,res)=>{
    if(req.session.is_logined == true) {
        const body = req.body;
        const RRN = body.RRN; //해당 사용자의 주민등록번호
        const time = body.time; //약 복용 시간
        const date = body.date; //약 복용 날짜
        const medecine = body.medecine; //복용해야 하는 약 이름

        client.query('select * from medicine_time where RRN=? and time=? and date=?',[RRN,time,date],(err,data)=>{
            if(data.length == 0){ 
                console.log('복용 시간이 입력되었습니다.');
                client.query('insert into medicine_time(RRN, time, date, medecine) values(?,?,?,?)',[
                    RRN, time, date, medecine
                ]);
            }else{  //중복된 데이터 값은 입력 불가
                console.log('복용 시간 입력 실패');
                res.send('복용 시간 입력에 실패하였습니다.');
            }
        });
    }else{
        res.send('로그인이 필요합니다.');
    }
});

module.exports = router;