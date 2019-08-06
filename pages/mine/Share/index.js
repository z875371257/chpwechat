// pages/mine/Share/index.js
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
      id: options.id
    })
    wx.request({
      url: app.globalData.api + 'Card?id=' + options.id + '&user_id=' + app.globalData.info.id,
      success: function (res) {
        wx.setNavigationBarTitle({
          title: '' + res.data.name
        })
        that.setData({
          card: res.data
        })
        that.MoreCard(res.data.name, that.data.id, app.globalData.info.id)
      }
    })
  },
  //  公司成员
  MoreCard: function (company, id, user_id) {
    var that = this
    wx.request({
      url: app.globalData.api + 'Card/MoreCard?company=' + company + '&id=' + id + '&user_id=' + user_id,
      success: function (res) {
        that.setData({
          Cards: res.data.data
        })
      }
    })
  },

  // 点击收藏
  CollectSave: function (e) {
    var that = this
    if (app.globalData.info.id) {
      if ( app.globalData.info.id == e.currentTarget.dataset.id ){
        app.Hint('不能自己收藏自己')
        return false;
      }
      wx.request({
        url: app.globalData.api + 'Card/SaveCollect?user_id=' + app.globalData.info.id + '&collect_id=' + e.currentTarget.dataset.id,
        success: function (res) {
          if (res.data.code == 200) {
            app.Hint('收藏成功')
            that.onLoad(that.data)
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
            that.onLoad(that.data)
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

  // 我的名片
  MyCard: function( e ) {
    var that = this
    if (app.globalData.info.id) {
      wx.navigateTo({
        url: '/pages/mine/UserCard/index?id=' + app.globalData.info.id
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

  GoHome: function () {
    wx.switchTab({
      url: '/pages/index/index'
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