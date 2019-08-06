// pages/article/show/index.js
const app = getApp()
const wxParser = require('../../../wxParser/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    SupplyModel: true,
    view: false,
    MyLevel: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ( e ) {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
  
    if( app.globalData.info.id == app.globalData.info.user_id && app.globalData.info.level_id == 4 ){
      that.setData({
        view: true
      })
    }
    
    wx.request({
      url: app.globalData.api + 'Article/show?id=' + e.id,
      success: function( res ) {
        // 获取文章详情  将图片大小宽度百分百
        var content = res.data.content
        res.data.content = content.replace(/\<img/gi, '<img style="width:100%;height:auto" ')
        // 设置小程序标题
        wx.setNavigationBarTitle({
          title: res.data.title
        })
        // 赋值接口内容给show
        that.setData({
          show: res.data,
        })
        //  wxParser插件展示详情页
        wxParser.parse({
          bind: 'richText',
          html: res.data.content,
          target: that
        })
        // 关闭加载中状态
        wx.hideLoading()
      }
    })
  },
  // 我要供货遮盖表单
  CanSupply: function(){
    this.setData({
      SupplyModel: !this.data.SupplyModel
    })
  },

  ShowCard: function (e) {
    wx.navigateTo({
      url: '/pages/company/card/index?id=' + e.currentTarget.dataset.id
    })
  },

  // 表单提交
  SupplyForm: function( e ) {
    var data = e.detail.value
    if ( data.truename == '' ) {
      app.Hint('请输入姓名')
      return false;
    }
    if (!/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(data.tel)) {
      app.Hint('手机号格式错误')
      return false;
    }
    var that = this
    wx.request({
      url: app.globalData.api + 'Usermore/Contact',
      method: 'POST',
      data: data,
      success: function (res) {
        app.Hint('提交成功！')
        
        that.setData({
          SupplyModel: !that.data.SupplyModel
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
    var that = this
    wx.request({
      url: app.globalData.api + 'Onshow?id=' + app.globalData.info.id,
      success: function (res) {
        that.setData({
          MyLevel: res.data.level_id
        })
      }
    })
  },
  CompanyRz: function () {
    wx.navigateTo({
      url: '/pages/mine/CompanyRz/index'
    })
  },

  Logins: function () {
    wx.navigateTo({
      url: '/pages/mine/Login/index'
    })
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