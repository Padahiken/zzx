const express = require('express');
const router = express.Router();
const db = require('../db/db');

// 获取所有图书分类
router.get('/category', async (req, res) => {
    const [list] = await db.query('SELECT * FROM book_category ORDER BY sort');
    res.json({ code: 200, data: list });
});

// 图书列表+搜索
router.get('/list', async (req, res) => {
    const { keyword = '' } = req.query;
    const sql = `
    SELECT b.*,c.cate_name 
    FROM book b 
    LEFT JOIN book_category c ON b.cate_id=c.cate_id
    WHERE b.book_name LIKE ?
  `;
    const [list] = await db.query(sql, [`%${keyword}%`]);
    res.json({ code: 200, data: list });
});

// 图书详情
router.get('/detail/:id', async (req, res) => {
    const id = req.params.id;
    const [detail] = await db.query('SELECT * FROM book WHERE book_id=?', [id]);
    res.json({ code: 200, data: detail[0] });
});

module.exports = router;