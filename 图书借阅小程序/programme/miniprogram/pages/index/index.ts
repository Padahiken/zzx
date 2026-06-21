// @ts-nocheck
const app = getApp();
Page({
  data: {
    keyword: "",
    bookList: []
  },
  // 页面初次加载，获取全部图书
  onLoad() {
    this.getBookList();
  },
  // 每次切换回首页自动刷新图书库存数据
  onShow() {
    this.getBookList();
  },
  // 监听搜索输入框文字变化
  inputChange(e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  // 点击搜索按钮触发检索
  searchBook() {
    this.getBookList();
  },
  // 请求图书列表接口，支持模糊搜索
  getBookList() {
    wx.showLoading({ title: "加载中" });
    wx.request({
      url: app.globalData.baseUrl + "/book/list?keyword=" + this.data.keyword,
      method: "GET",
      success: (res) => {
        this.setData({
          bookList: res.data.data
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  },
  // 点击图书条目跳转详情页，传递图书ID
  goDetail(e) {
    const bookId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/detail/detail?id=" + bookId
    })
  }
})