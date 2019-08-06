// pages/product/index.
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    limit: 0,   // 全局分页
    keyword: '找采购',  // 全局关键字
    NotArt: true,  // 判断是否还有产品 没有会出现没有更多  有会出现加载更多按钮
    article: [],   //产品列表遍历  加载更多可累加
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 默认加载中状态 会在产品请求成功后被关闭
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    // 获取采购信息
    that.GetArticle()
  },


  // 产品搜索
  bindchange: function (e) {
    var that = this
    var str = e.detail.value.replace(/\s+/g, "");
    if (str == '') {
      return false
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    that.setData({
      keyword: e.detail.value
    })
    that.GetArticle(0, that.data.keyword)
  },

  // 获取更多采购信息
  More: function (e) {
    var that = this
    var limit = that.data.limit + 10

    that.setData({
      limit: limit
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.api + 'Article',
      method: 'POST',
      data: {
        limit: that.data.limit,
        keyword: that.data.keyword
      },
      success: function (e) {
        var article = that.data.article.concat(e.data.data)
        if (e.data.count == 10) {
          that.setData({
            article: article,
            NotArt: true
          })
        } else {
          that.setData({
            article: article,
            NotArt: false
          })
        }
        wx.hideLoading()

      }
    })

  },

  // 获取采购接口
  GetArticle: function ( limit = 0, keyword = '') {
    var that = this;
    wx.request({
      url: app.globalData.api + 'article',
      method: 'POST',
      data: {
        limit: '' + limit,
        keyword: keyword
      },
      success: function (e) {
        if (e.data.count == 10) {
          that.setData({
            article: e.data.data,
            NotArt: true
          })
        } else {
          that.setData({
            article: e.data.data,
            NotArt: false
          })
        }
        wx.hideLoading()
      }
    })

  },

  // 采购内页跳转
  ArticleShow: function (res) {
    wx.navigateTo({
      url: '/pages/article/show/index?id=' + res.currentTarget.dataset.id
    })
  },

  // 公司内页跳转
  CompanyShow: function (res) {
    wx.navigateTo({
      url: '/pages/company/show/index?id=' + res.currentTarget.dataset.id
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
    this.GetArticle()
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