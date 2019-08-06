//app.js
App({

  globalData: {
      api: 'https://www.chplaza.cn/api/',
      info: '',
  },

  Hint: function (hint) {
    wx.showModal({
      title: '提示',
      content: hint,
      showCancel: false,
    })
  },

  onLaunch: function () {
    // 将获取缓存中的用户信息 设置为全局变量
    let that = this
    wx.getStorage({
      key: 'UserInfo',
      success: function (res) {
        that.globalData.info = res.data
      }
    })

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

})