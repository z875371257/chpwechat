// pages/mine/index.
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cate: true,   //分类展开默认隐藏
    cate1: '100%',  //一级分类默认宽度百分百
    cate2: '0%',  //二级分类默认宽度
    cate3: '0%',  // 三级分类默认宽度
    pid: 0,    // 全局的分类ID
    limit: 0,   // 全局分页
    keyword: '找产品',  // 全局关键字
    NotPro: true,  // 判断是否还有产品 没有会出现没有更多  有会出现加载更多按钮
    cover: true,  // 分类选择遮盖框
    covers: true,  //城市选择遮盖框
    product: [],   //产品列表遍历  加载更多可累加
    catename: '全部分类',  // 分类被选中后会更改分类名称
    city: '全国',  // 城市被选中后会更改城市名称
    ActiveCity: 2000,  // 默认选择全国城市给选择状态
    CityList: true,   //是否点击了城市 给筛选栏选中状态
    SiftShow: true  // 精选推荐选中状态
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

      // 获取一级分类
      wx.request({
        url: app.globalData.api + 'cate',
        success: function( res ){
          that.setData({
            cate1list: res.data
          })
        }
      })

      // 获取城市
      wx.request({
        url: app.globalData.api + 'cate/GetCity',
        success: function( res ){
          that.setData({
            citys: res.data
          })
        }

      })
      // 获取产品
      that.GetPro(that.data.pid,0,'','全国', false)
  },
  
  // 精选推荐
  Sift: function(  ) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.setData({
      SiftShow: false,
      cover: true,
      covers: true,
      cate: true,
      CityList: true
    })
    // 条件刷新了， 只保留cate_id
    this.GetPro(this.data.pid, 0, '', '全国', true)   
  },
  // 分类点击筛选事件
  CateShow: function(  ) {
    this.setData({
      cate: !this.data.cate,
      cover: !this.data.cover,
      CityList: true,
      SiftShow: true,
      covers: true
    })
  },

  // 城市点击筛选事件
  CityShow: function() {
    this.setData({
      CityList: !this.data.CityList,
      covers: !this.data.covers,
      cover: true,
      cate: true,
      SiftShow: true
    })
  },

  // 城市点击选择事件
  CitySelect: function( e ) { 
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    that.setData({
      city: e.target.dataset.name,
      ActiveCity: e.target.dataset.index,
      CityList: !this.data.CityList,
      covers: !this.data.covers,
      cover: true
    })
    that.GetPro(that.data.pid, 0, '', that.data.city, false)
    
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
    that.GetPro(that.data.pid, that.data.limit, that.data.keyword, that.data.city, false)
    
  },
  //  二级分类点击事件
  CateOneSelect: function ( e ) {
      var that = this
      var id = e.currentTarget.id
      wx.request({
        url: app.globalData.api + 'cate/GetCate?id=' + id,
        success: function (res) {
           that.setData({
             aActive: e.target.dataset.index,
             cate2list: res.data,
             cate1: '50%',
             cate2: '50%',
             cate2id: id,
             cate3: '0%',
             cate2name: e.target.dataset.name
           })
        }
      })
  },
  // 三级分类点击事件
  CateTwoSelect: function( e ) {
    console.log(e)
    var that = this
    var id = e.currentTarget.id
    wx.request({
      url: app.globalData.api + 'cate/GetCate?id=' + id,
      success: function (res) {
        that.setData({
          bActive: e.target.dataset.index,
          cate3list: res.data,
          cate1: '33.4%',
          cate2: '33.3%',
          cate3: '33.3%',
          cate3id: id,
          cate3name: e.target.dataset.name
        })
      }
    })
  },
  // 点击分类里的获取产品
  GetPros: function( e ) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var pid = e.currentTarget.id
    this.setData({
      pid: pid,
      cate: true,
      limit: 0,
      catename: e.target.dataset.name,
      cover: !this.data.cover,
      covers: true
    })
    this.GetPro(pid, 0, this.data.keyword, this.data.city, false)
  },
  // 获取更多产品
  More: function( e ) {
    var that = this
    var limit = that.data.limit + 10
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    that.setData({
      limit: limit
    })
  
    wx.request({
      url: app.globalData.api + 'cate/GetProduct',
      method: 'POST',
      data: {
        cate_id: that.data.pid,
        limit:  that.data.limit,
        keyword: that.data.keyword,
        city: that.data.city,
        sift: false
      },
      success: function (e) {
        var product = that.data.product.concat(e.data.data)
        if (e.data.count ==10) {
          that.setData({
            product: product,
            NotPro: true
          })
        }  else {
          that.setData({
            product: product,
            NotPro: false
          })
        }
        wx.hideLoading()

      }
    })

  },

  // 获取产品接口
  GetPro: function( pid = 0, limit = 0, keyword='', city='全国', sift=false ){
    var that = this;
    wx.request({
      url: app.globalData.api + 'product',
      method: 'POST',
      data: {
        cate_id : pid,
        limit : ''+limit,
        keyword: keyword,
        city: that.data.city,
        sift: sift
      },
      success: function ( e ){
        if( e.data.count == 10 ){
          that.setData({
            product: e.data.data,
            NotPro: true
          })
        }  else {
          that.setData({
            product: e.data.data,
            NotPro: false
          })
        }
        wx.hideLoading()
      }
    })

  },

  // 产品内页跳转
  ProductShow: function (res) {
    wx.navigateTo({
      url: '/pages/product/show/index?id=' + res.currentTarget.dataset.id
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
    this.GetPro(this.data.pid)
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