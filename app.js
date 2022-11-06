const fs = require('fs');
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const crypto = require('crypto');
const FileStore = require('session-file-store')(session); // 세션을 파일에 저장
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

app.use(express.json({limit: '50mb'}));
app.use(express.static(path.join(__dirname,'/public')));
app.use(bodyParser.urlencoded({extended:false})); // 정제 (미들웨어) 5
// 세션 (미들웨어) 6 
app.use(session({
    secret: 'blackzat', // 데이터를 암호화 하기 위해 필요한 옵션
    resave: false, // 요청이 왔을때 세션을 수정하지 않더라도 다시 저장소에 저장되도록
    saveUninitialized: true, // 세션이 필요하면 세션을 실행시칸다(서버에 부담을 줄이기 위해)
    store : new FileStore() // 세션이 데이터를 저장하는 곳
}));

var loginRouter = require('./routes/manager');
var medicine_time_Router = require('./routes/medicine_time');

app.use('/manager', loginRouter);
app.use('/medicineTime', medicine_time_Router);

app.get('/',(req,res)=>{
    console.log('메인페이지 작동');
    console.log(req.session);
    if(req.session.is_logined == true){
       res.send('로그인되었습니다.')
    }else{
       res.send('로그인 하세요')
    }
});

app.listen(port,() => {
    console.log('서버 실행');
})