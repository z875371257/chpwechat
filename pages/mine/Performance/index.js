// pages/mine/Performance/index.js
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
    that.setData({
      info: app.globalData.info
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.setNavigationBarTitle({
      title: '公司业绩'
    })

    that.GetYj()
  },


  AddYj: function () {
    if (app.globalData.info.id != app.globalData.info.user_id) {
      app.Hint('只有管理员有此操作')
      return false;
    }
    wx.navigateTo({
      url: 'Add/index?company='+this.data.info.company
    })
  },

  DelData: function (e) {
    var that = this
    if (app.globalData.info.id != app.globalData.info.user_id) {
      app.Hint('只有管理员有此操作')
      return false;
    }
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.api + 'Mine/RemovePerformance?id=' + e.currentTarget.dataset.id,
            success: function (e) {
              that.GetYj();
            }
          })
        }
      }
    })
  },

  GetYj: function () {
    var that = this
    wx.request({
      url: app.globalData.api + 'Mine/PerformanceList?company=' + that.data.info.company,
      success: function (res) {
        that.setData({
          Yj: res.data
        })
        wx.hideLoading()
      }
    })
  },

  EditData: function (e) {
    var that = this
    if (app.globalData.info.id != app.globalData.info.user_id) {
      app.Hint('只有管理员有此操作')
      return false;
    }
    wx.navigateTo({
      url: 'Edit/index?id=' + e.currentTarget.dataset.id,
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