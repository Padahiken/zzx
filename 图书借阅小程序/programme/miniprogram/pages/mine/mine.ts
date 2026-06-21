// @ts-nocheck
const app = getApp();
Page({
  data: {
    borrowList: []
  },
  // 每次进入/切回页面自动加载借阅记录
  onShow() {
    this.getBorrowRecord();
  },
  // 查询固定用户id=1的所有借阅记录
  getBorrowRecord() {
    const userId = 1;
    wx.request({
      url: app.globalData.baseUrl + '/borrow/my/' + userId,
      method: "GET",
      success: (res) => {
        this.setData({
          borrowList: res.data.data
        })
      }
    })
  },
  // 归还图书按钮事件
  backBook(e) {
    // 获取当前记录id
    const recordId = e.currentTarget.dataset.recordid;
    wx.showLoading({ title: "归还中" });
    wx.request({
      url: app.globalData.baseUrl + "/borrow/back",
      method: "POST",
      data: { recordId },
      success: (res) => {
        if (res.data.code === 200) {
          wx.showToast({ title: "归还成功" });
          // 归还成功刷新借阅列表
          this.getBorrowRecord();
        } else {
          wx.showToast({ title: res.data.msg, icon: "none" });
        }
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  }
})