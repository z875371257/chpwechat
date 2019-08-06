// Pages/mine/UserCard/index.js
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
    var that = this
    wx.request({
      url: app.globalData.api + 'Card?id=' + options.id + '&user_id=' + app.globalData.info.id,
      success: function( res ){
        wx.setNavigationBarTitle({
          title: ''+ res.data.name
        })
        that.setData({
          card: res.data
        })
      }
    })
  },

  // 公司内页跳转
  CompanyShow: function (res) {
    wx.navigateTo({
      url: '/pages/company/show/index?id=' + res.currentTarget.dataset.id
    })
  },

  // 名片电话拨打
  CallTel: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
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
    var that = this
    if (res.from == 'menu') {
      // 来自页面内转发按钮
      return {
        title: '' + that.data.card.company,
        path: '/pages/mine/Share/index?id=' + that.data.card.id,
        imageUrl: '/images/ShareCard.png',
        success: function (res) {
          // 转发成功
        }
      }
    }
    if (res.from == 'button') {
      // 来自页面内转发按钮
      return {
        title: '' + that.data.card.company,
        path: '/pages/mine/Share/index?id=' + that.data.card.id,
        imageUrl: '/images/ShareCard.png',
        success: function (res) {
          // 转发成功
        }
      }
    }
  }

})