// pages/mine/Message/index.js
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
    // 设置小程序标题
    wx.setNavigationBarTitle({
      title: '我的消息'
    })

    this.GetMessage();
    
  },
  // 获取我的消息
  GetMessage: function(){
    var that = this
    wx.request({
      url: app.globalData.api + 'Message?recvuser_id=' + app.globalData.info.id,
      success: function(res){
        that.setData({
          message: res.data
        })
      }
    })
  },
  MessageStatus: function(e){
    var that = this
    wx.request({
      url: app.globalData.api + 'UserMore/MessageStatus',
      data: e.currentTarget.dataset,
      method: 'POST',
       success: function (res) {
        that.GetMessage();
      }
    })
  },

  MessageDel: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.api + 'UserMore/DelMessage?id=' + e.currentTarget.dataset.id,
            success: function (res) {
              that.GetMessage();
            }
          })
        }
      }
    })
  },

  ShowMessage: function (e) {
    wx.navigateTo({
      url: 'show/index?id=' + e.currentTarget.dataset.id
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成s
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