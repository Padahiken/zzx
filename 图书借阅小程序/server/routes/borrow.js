const express = require('express');
const router = express.Router();
const db = require('../db/db');
const dayjs = require('dayjs');

// 提交借阅
router.post('/add', async (req, res) => {
    const { userId, bookId } = req.body;
    // 查询库存
    const [book] = await db.query('SELECT total_num,borrow_num FROM book WHERE book_id=?', [bookId]);
    const total = book[0].total_num;
    const borrow = book[0].borrow_num;
    if (borrow >= total) {
        return res.json({ code: 400, msg: '库存不足，无法借阅' });
    }
    // 借阅期限30天
    const deadline = dayjs().add(30, 'day').format('YYYY-MM-DD HH:mm:ss');
    // 新增借阅记录
    await db.query(`INSERT INTO borrow_record(user_id,book_id,return_deadline,status) VALUES (?,?,?,1)`, [userId, bookId, deadline]);
    // 更新图书已借出数量
    await db.query('UPDATE book SET borrow_num=borrow_num+1 WHERE book_id=?', [bookId]);
    res.json({ code: 200, msg: '借阅成功' });
});

// 查询我的借阅记录
router.get('/my/:userId', async (req, res) => {
    const userId = req.params.userId;
    const sql = `
    SELECT r.*,b.book_name,b.cover_img 
    FROM borrow_record r
    LEFT JOIN book b ON r.book_id = b.book_id
    WHERE r.user_id=?
    ORDER BY r.borrow_time DESC
  `;
    const [list] = await db.query(sql, [userId]);
    res.json({ code: 200, data: list });
});

// 归还图书接口
router.post("/back", async (req, res) => {
    const { recordId } = req.body;
    try {
        // 1. 根据借阅记录ID查询这条记录
        const recordList = await db.query("SELECT * FROM borrow_record WHERE record_id = ?", [recordId]);
        if (recordList.length === 0) {
            return res.json({ code: 400, msg: "不存在该借阅记录" });
        }
        const recordInfo = recordList[0];
        // 判断是否已经归还
        if (recordInfo.status === 2) {
            return res.json({ code: 400, msg: "该图书已归还，无需重复操作" });
        }
        const targetBookId = recordInfo.book_id;
        // 2. 更新借阅记录状态为2（已归还）
        await db.query("UPDATE borrow_record SET status = 2 WHERE record_id = ?", [recordId]);
        // 3. 归还：已借出数量 borrow_num 减1，剩余库存 = total_num - borrow_num 自动变多
        await db.query("UPDATE book SET borrow_num = borrow_num - 1 WHERE book_id = ?", [targetBookId]);
        return res.json({ code: 200, msg: "归还成功" });
    } catch (err) {
        console.log("归还接口报错：", err);
        return res.json({ code: 500, msg: "归还失败，服务器异常" });
    }
})

module.exports = router;