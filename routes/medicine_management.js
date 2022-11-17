const router = require('express').Router();
const client = require('../db');

router.post('/input',(req,res)=>{
    if(req.session.is_logined == true) {
        const body = req.body;
        const medicine = body.medicine; //해당 약품 이름
        const recommended_dose = body.recommaned_dose; //1회 권장 용량
        const number_of_doses = body.number_of_doses; //1일 투약 횟수
        const weight = body.weight; //약 무게
        const memo = body.memo; //메모

        client.query('select * from medicine_management where medicine=?',[medicine],(err,data)=>{
            if(data.length == 0){ 
                const result = client.query('insert into medicine_management(medicine, recommended_dose, number_of_doses,weight, memo) values(?,?,?,?,?)',[
                    medicine, recommended_dose, number_of_doses, weight, memo
                ]);
                console.log('약품 정보가 입력되었습니다.');
                res.send('약품 정보가 입력되었습니다.');
            }else{  //중복된 데이터 값은 입력 불가
                console.log('약품 정보 입력 실패');
                res.send('해당 약품 정보가 이미 등록되어있습니다.');
            }
        });
    }else{
        res.send('로그인이 필요합니다.');
    }
});

router.delete('/delete/:medicine', (req,res)=>{
    if(req.session.is_logined == true) {
        const {medicine} = req.params;
        client.query('select * from medicine_time where medicine=?',[medicine],(err,data)=>{
            if(data.length == 0){ 
                const result = client.query('delete from medicine_management where medicine=?',[medicine]);
                res.send('삭제되었습니다.');
            }else{  // 약 복용 시간 테이블에 저장되어 있는 데이터는 삭제 불가
                console.log('해당 약품은 삭제할 수 없습니다.');
                res.send('해당 약품은 삭제할 수 없습니다.');
            }
        });
    }else{
        res.send('로그인이 필요합니다.');
    }
});

router.get('/list', (req,res)=>{
    if(req.session.is_logined == true){
        client.query('select * from medicine_management',(err,data)=>{
            res.json(data);
        })
    }
    else {
        res.send('로그인이 필요합니다.');
    };
});

module.exports = router;