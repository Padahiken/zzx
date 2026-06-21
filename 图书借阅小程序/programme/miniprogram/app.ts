// app.ts 小程序全局入口文件
App<IAppOption>({
  globalData: {
    // 后端服务基础接口地址，统一管理所有请求
    baseUrl: "http://localhost:3000/api"
  },
  // 小程序初始化时触发
  onLaunch() {
    console.log("校园图书借阅小程序启动成功");
  }
})