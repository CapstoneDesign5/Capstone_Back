const fs = require('fs');
const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const crypto = require('crypto');
const FileStore = require('session-file-store')(session); // 세션을 파일에 저장
const cookieParser = require('cookie-parser');

const app = express();
const port = 5000;

let corsOptions = {
    origin: "*", // 출처 허용 옵션
    credential: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
};
  
app.use(cors(corsOptions));
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
var medicine_management_Router = require('./routes/medicine_management');
var customer_Router = require('./routes/customer');

app.use('/manager', loginRouter);
app.use('/medicineTime', medicine_time_Router);
app.use('/medicineManagement', medicine_management_Router);
app.use('/customer', customer_Router);

app.listen(port,() => {
    console.log('서버 실행');
})