// pages/mine/Message/show/index.js
const app = getApp()
const wxParser = require('../../../../wxParser/index.js');
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
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.api + 'UserMore/GetMessage?id=' + options.id,
      success: function (res) {
        that.setData({
          show: res.data
        })
        var pages = getCurrentPages();  //获取当前打开的页面栈，返回为数组，索引顺序为打开的顺序
        var prePages = pages[pages.length - 2];  //获取到上一个页面对象
        prePages.GetMessage();  //执行上一个页面对象中的刷新数据方法
        wx.hideLoading()
        //  wxParser插件展示详情页
        wxParser.parse({
          bind: 'richText',
          html: res.data.content,
          target: that
        })

      }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})