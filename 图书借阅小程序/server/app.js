const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// 全局中间件
app.use(cors()); // 允许跨域，小程序才能访问接口
app.use(express.json()); // 接收post请求的json参数

// 挂载所有接口路由
app.use('/api/book', require('./routes/book'));
app.use('/api/user', require('./routes/user'));
app.use('/api/borrow', require('./routes/borrow'));

// 启动服务
app.listen(port, () => {
    console.log(`后端服务启动成功！地址：http://localhost:${port}`);
})