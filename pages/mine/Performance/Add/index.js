// pages/mine/Performance/Add/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2019-01-01',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      company: options.company
    })
  },
  SaveForm: function( e ){
    var that = this
    var XY = e.detail.value
    if( XY.description == 0 ){
      that.RegisterHint('业绩详情不能为空')
      return false;
    }
    wx.request({
      url: app.globalData.api + 'Mine/SavePerformance',
      data: XY,
      method: 'POST',
      success: function (res) {
        if (res.data == 1) {
          that.RegisterHint('添加成功')
          var pages = getCurrentPages();  //获取当前打开的页面栈，返回为数组，索引顺序为打开的顺序
          var prePages = pages[pages.length - 2];  //获取到上一个页面对象
          prePages.GetYj();  //执行上一个页面对象中的刷新数据方法
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000)
        }
      }
    })

  },

  RegisterHint: function (hint) {
    wx.showModal({
      title: '提示',
      content: hint,
      showCancel: false,
    })
  },
  // 日期选择
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
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