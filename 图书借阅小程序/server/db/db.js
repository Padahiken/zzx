const mysql = require('mysql2/promise');

// 数据库连接池，修改里面root和123456为你自己MySQL账号密码
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',       // 你的MySQL用户名，默认root
    password: 'zzx220037', // 你安装MySQL时设置的密码
    database: 'book_library',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;