// pages/mine/Article/index.js
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
      title: '公司采购'
    })
    
    that.GetArticle();
  },

  AddArticle: function () {
    if (app.globalData.info.id != app.globalData.info.user_id) {
      app.Hint('只有管理员有此操作')
      return false;
    }
    wx.navigateTo({
      url: 'Add/index'
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
            url: app.globalData.api + 'Mine/RemoveArticle?id=' + e.currentTarget.dataset.id,
            success: function (e) {
              that.GetArticle();
            }
          })
        }
      }
    })
  },

  GetArticle: function () {
    var that = this
    wx.request({
      url: app.globalData.api + 'Mine/ArticleList?company_id=' + that.data.info.company_id,
      success: function (res) {
        that.setData({
          ArticleList: res.data
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

})