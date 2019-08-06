// pages/mine/UserInfo/edit/Email.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '职务修改'
    })

    this.setData({
      info: app.globalData.info
    })
  },
  SaveForm: function (e) {
    var that = this
    var FD = e.detail.value
    if (FD.posts == '') {
      that.RegisterHint('邮箱不能为空')
      return false;
    } 

    FD.id = that.data.info.id
    wx.request({
      url: app.globalData.api + 'Mine/SaveInfo',
      method: 'POST',
      data: FD,
      success: function (res) {
        if (res.data == 1) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1000,
          })
          that.data.info.posts = FD.posts
          wx.setStorage({
            key: "UserInfo",
            data: that.data.info
          })
          var pages = getCurrentPages();  //获取当前打开的页面栈，返回为数组，索引顺序为打开的顺序
          var prePages = pages[pages.length - 2];  //获取到上一个页面对象
          prePages.onLoad();  //执行上一个页面对象中的刷新数据方法
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000)
         
        }
      }
    })

  },

  // 弹框提示
  RegisterHint: function (hint) {
    wx.showModal({
      title: '提示',
      content: hint,
      showCancel: false,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


})