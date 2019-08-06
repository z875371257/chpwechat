// pages/mine/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    IsLogin: true,
    info: '',
    Pop: true,
    readmessage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this 
    wx.getStorage({
      key: 'Hints',
      success: function (res) {
        wx.getStorage({
          key: 'UserInfo',
          success: function(res) {
            wx.request({
              url: app.globalData.api + 'Mine?company_id='+res.data.company_id +'&id='+res.data.id,
              success: function(e){
                if( e.data.data != ''){
                  that.setData({
                    Pop: false,
                    Adver: e.data.data
                  })
                }
                if( e.data.readmessage != null){
                  that.setData({
                    readmessage: true
                  })
                }
              }
            })
            that.setData({
              IsLogin: false,
              info: res.data
            })
          },
        })
      },
      fail: function () {
        that.setData({
          IsLogin: true
        })
        wx.showModal({
          title: '清洁供热商务通提示您请先登录',
          content: '请登录您的账户，获得更多服务',
          confirmText: '现在登录',
          cancelText: '暂不登录',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: 'Login/index'
              })
            } else if (res.cancel) {
              wx.setStorage({
                key: "Hints",
                data: 1
              })
            }
          }
        })
      }
    })
  },
  // 关闭弹框广告
  Closes: function () {
    this.setData({
      Pop: true,
    })
  },
  ShowDetail: function( e  ) {
    var that = this
    var hint = ''
    var Tz = 'UserInfo/index';
    if (e.currentTarget.dataset.type == 3) {
      Tz = 'UserInfo/index';
    } else if (e.currentTarget.dataset.type == 0) {
      Tz = 'UserCard/index?id='+this.data.info.id
    } else if (e.currentTarget.dataset.type == 1) {
      Tz = 'Auth/index'
    } else if (e.currentTarget.dataset.type == 2) {
      Tz = 'CompanyRz/index'
    } else if (e.currentTarget.dataset.type == 6) {
      Tz = '/pages/company/show/index?id=' + this.data.info.company_id
    } else if (e.currentTarget.dataset.type == 7) {
      Tz = 'Colleague/index'
    } else if (e.currentTarget.dataset.type == 8) {
      Tz = 'Client/index'
    } else if (e.currentTarget.dataset.type == 9) {
      if (app.globalData.info.level_id == 1) {
        hint = '未认证会员不能发布产品'
      }
      Tz = 'Product/index'
    } else if (e.currentTarget.dataset.type == 10) {
      if (app.globalData.info.level_id == 1) {
        hint = '未认证会员不能发布采购信息'
      }
      Tz = 'Article/index'
    } else if (e.currentTarget.dataset.type == 11) {
      Tz = 'Company/index'
    } else if (e.currentTarget.dataset.type == 12) {
      Tz = 'Performance/index'
    } else if (e.currentTarget.dataset.type == 13) {
      Tz = 'Certificate/index'
    } else if (e.currentTarget.dataset.type == 'message') {
      Tz = 'Message/index'
    } else if (e.currentTarget.dataset.type == 'login') {
      Tz = 'Login/index'
    } else if (e.currentTarget.dataset.type == 'register') {
      Tz = 'Register/index'
      wx.navigateTo({
        url: Tz
      })
    }
    
    if (that.data.info == '') {
      wx.navigateTo({
        url: '/pages/mine/Login/index',
      })
    } else {
      if ( hint == '') {
        wx.navigateTo({
          url: Tz
        })
      } else {
        app.Hint(hint)
        return false;
      }
     
    }
  },
  
  Clear:function(){
    var that = this
    if( app.globalData.info ){
      wx.showModal({
        title: '',
        content: '您确定要退出登录吗？',
        success: function (res) {
          if (res.confirm) {


            wx.removeStorage({
              key: 'UserInfo',
              success: function (res) {
                that.setData({
                  IsLogin: true,
                  info: ''
                })
                app.globalData.info = ''
                wx.showToast({
                  title: '退出成功',
                  icon: 'success',
                  duration: 1000
                })
              }
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1000
      })
    }

    

 
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

    wx.getStorage({
      key: 'UserInfo',
      success: function (res) {
        wx.request({
          url: app.globalData.api + 'Onshow?id=' + that.data.info.id,
          success: function (e) {
            if (e.data != 0) {
              that.setData({
                info: e.data
              })
              wx.setStorage({
                key: "UserInfo",
                data: e.data
              })
              app.globalData.info = e.data
            }
          }
        })
        wx.request({
          url: app.globalData.api + 'Mine?company_id=' + res.data.company_id + '&id=' + res.data.id,
          success: function (e) {
            if (e.data.readmessage != null) {
              that.setData({
                readmessage: true
              })
            } else {
              that.setData({
                readmessage: false
              })
            }
          }
        })
      },
      fail: function( res ){
        that.setData({
          readmessage: false
        })
      }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: '清洁供热商务通',
        path: '/pages/index/index',
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
  }

})