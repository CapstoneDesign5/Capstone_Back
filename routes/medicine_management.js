const router = require('express').Router();
const client = require('../db');

router.post('/input',(req,res)=>{
        const body = req.body;
        const medicine = body.medicine; //해당 약품 이름
        const recommended_dose = body.recommanded_dose; //1회 권장 용량
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
                res.sendStatus(401);
            }
        });
});

router.post('/delete', (req,res)=>{
        const body = req.body;
        const medicine = body.medicine;
        console.log(medicine);
        client.query('select * from medicine_time where medicine=?',[medicine],(err,data)=>{
            if(data.length == 0){ 
                const result = client.query('delete from medicine_management where medicine=?',[medicine]);
                res.send('삭제되었습니다.');
                console.log('약품이 삭제되었습니다.');
            }else{  // 약 복용 시간 테이블에 저장되어 있는 데이터는 삭제 불가
                console.log('해당 약품은 삭제할 수 없습니다.');
                res.sendStatus(401);
            }
        });
});

router.get('/list', (req,res)=>{
        client.query('select * from medicine_management',(err,data)=>{
            res.json(data);
        })
});

//해당 약품 정보 출력
router.post('/Info',(req,res)=>{
    const body = req.body;
    const medicine = body.medicine; //해당 사용자의 주민등록번호

    client.query('select * from medicine_management where medicine=?',[medicine],(err,data)=>{
        if(data.length == 0){ 
            console.log('약품 정보가 존재하지 않습니다.');
            res.sendStatus(401);
        }else{  
            res.json(data);
        }
    });
});

//약품 정보 변경
router.post('/Update', (req,res)=> {
    const body = req.body;
    const medicine = body.medicine;
    const NewRecommended_dose = body.recommended_dose;
    const NewNumber_of_doses = body.number_of_doses;
    const NewWeight = body.weight;
    const NewMemo = body.memo;

    client.query(
        'select * from medicine_management where medicine=?',[medicine],(err,data)=> {
            if(data.length == 0) {
                console.log('해당 약품이 존재하지 않습니다.');
                res.sendStatus(401);
            }else{
                const result = client.query('update medicine_management set recommended_dose=?, number_of_doses=?, weight=?, memo=? where medicine=?',[NewRecommended_dose, NewNumber_of_doses, NewWeight, NewMemo, medicine]);
                console.log('약품 정보가 변경되었습니다.');
                res.send('약품 정보가 변경되었습니다.');
            }
    });
});

module.exports = router;