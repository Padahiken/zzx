const express = require('express');
const router = express.Router();
const db = require('../db/db');

// 微信登录接口
router.post('/login', async (req, res) => {
    const { openid, nickName, avatarUrl } = req.body;
    // 查询用户是否已存在
    const [user] = await db.query('SELECT * FROM user WHERE openid=?', [openid]);
    if (user.length > 0) {
        return res.json({ code: 200, data: user[0] });
    }
    // 不存在则新增用户
    const insertSql = 'INSERT INTO user(openid,nick_name,avatar) VALUES (?,?,?)';
    const [result] = await db.query(insertSql, [openid, nickName, avatarUrl]);
    const newUser = {
        id: result.insertId,
        openid,
        nick_name: nickName,
        avatar: avatarUrl
    }
    res.json({ code: 200, data: newUser });
});

module.exports = router;