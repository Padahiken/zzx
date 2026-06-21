// @ts-nocheck
const app = getApp();
Page({
  data: {
    book: null
  },
  onLoad(options) {
    // 接收首页传递过来的图书ID
    this.bookId = options.id;
    this.getDetail();
  },
  // 获取单本图书详情
  getDetail() {
    wx.showLoading({ title: "加载中" });
    wx.request({
      url: app.globalData.baseUrl + "/book/detail/" + this.bookId,
      method: "GET",
      success: (res) => {
        this.setData({
          book: res.data.data
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },
  // 借阅按钮点击事件
  borrowBtn() {
    // 固定测试用户ID
    const userId = 1;
    wx.showLoading({ title: "提交借阅" });
    wx.request({
      url: app.globalData.baseUrl + "/borrow/add",
      method: "POST",
      data: {
        userId: userId,
        bookId: this.bookId
      },
      success: (res) => {
        if (res.data.code === 200) {
          wx.showToast({ title: "借阅成功" });
          // 借阅完成立刻刷新当前页面库存，不用返回重进
          this.getDetail();
        } else {
          wx.showToast({ title: res.data.msg, icon: "none" });
        }
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  }
})