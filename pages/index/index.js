//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    CityList: true,
    CardShow: true,
    collect: true,
    Pop:true,
  },
  
  onLoad: function () {
      var that = this;
      wx.showLoading({
        title: '加载中',
        mask: true
      })
  
      if ( app.globalData.info == '' ) {
        that.setData({
          Pop: false
        })
      }
      wx.request({
        url: app.globalData.api + 'Applet_index',
        success: function( res ){
          that.setData({
            data: res.data.data
          })
          wx.hideLoading()
        }
      })
  },

  // 查看名片
  ViewCard: function( e ){
    var that = this
    // 先查看登录用户是否已经收藏   获取结构后改变收藏按钮样式
    wx.request({
      url: app.globalData.api + 'Card/Collect?user_id=' + app.globalData.info.id + '&collect_id=' + e.currentTarget.dataset.id,
      success: function( res ){
        that.setData({
          collect: res.data.data
        })
      }
    })
    //  打开名片并赋值
    wx.request({
      url: app.globalData.api + 'Card?id=' + e.currentTarget.dataset.id + '&user_id='+ app.globalData.info.id,
      success: function (res) {
        that.setData({
          CardShow: false,
          card: res.data
        })
      }
    })
  },

  // 点击收藏
  CollectSave: function( e ){
    var that = this 
    if (app.globalData.info.id ){
      wx.request({
        url: app.globalData.api + 'Card/SaveCollect?user_id=' + app.globalData.info.id + '&collect_id=' + e.currentTarget.dataset.id,
        success: function( res ){
          if( res.data.code == 200){
            app.Hint('收藏成功')
            that.setData({
              CardShow: true
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先进行登录',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/mine/Login/index'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    

  },

  // 点击取消收藏
  CollectDel: function (e) {
    var that = this
    if (app.globalData.info.id) {
      wx.request({
        url: app.globalData.api + 'Card/DelCollect?user_id=' + app.globalData.info.id + '&collect_id=' + e.currentTarget.dataset.id,
        success: function (res) {
          if (res.data.code == 200) {
            app.Hint('取消收藏成功')
            that.setData({
              CardShow: true
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先进行登录',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/mine/Login/index'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

  },
  
  // 打开关闭遮盖
  Close: function( ){
    this.setData({
      CardShow: !this.data.CardShow,
    })
  },

  // 关闭弹框广告
  Closes: function () {
    this.setData({
      Pop: true,
    })
    wx.setStorage({
      key: "Pop",
      data: 1
    })
  },

  // 文章内页跳转
  ChpArticleShow: function( res ){
    wx.navigateTo({
      url: 'ArticleShow/index?id=' + res.currentTarget.dataset.id
    })
  },
  // 采购内页跳转
  ArticleShow: function (res) {
    wx.navigateTo({
      url: '/pages/article/show/index?id=' + res.currentTarget.dataset.id
    })
  },

  ShowRegister: function( res ) {
    wx.navigateTo({
      url: '/pages/mine/Login/index'
    })
  },

  // 公司内页跳转
  CompanyShow: function (res) {
    wx.navigateTo({
      url: '/pages/company/show/index?id=' + res.currentTarget.dataset.id
    })
  },

  CompanyMore: function( ){
    wx.switchTab({
      url: '/pages/company/index'
    })
  },

  CallTel: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },

  onShow: function( e ){
    var that = this

    wx.getStorage({
      key: 'Pop',
      success: function(res){
        that.setData({
          Pop: true
        })
      },
      fail: function(){
        that.setData({
          Pop: false
        })
      }
    })

  } ,

  onShareAppMessage: function (res) {
  
  }
  
})
