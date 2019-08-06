// pages/company/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ScreenActive: 1,
    city: '全国',
    CityList: true,
    ActiveCity: 2000,
    sort: 1,
    cover: true,
    limit: 0,
    keyword: '找公司',
    company: [],
    NotCom: true,
    CardShow: true,
    collect: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    // 获取城市
    wx.request({
      url: app.globalData.api + 'company/GetCity',
      success: function (res) {
        that.setData({
          citys: res.data
        })
      }
    })

    that.GetCompany(that.data.limit, that.data.sort, that.data.city, that.data.keyword)
  },


  // 公司搜索
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
    that.GetCompany(that.data.limit, that.data.sort, that.data.city, that.data.keyword)
  },

  // 城市点击筛选事件
  CityShow: function () {
    this.setData({
      CityList: !this.data.CityList,
      cover: !this.data.cover,
    })
  },

  // 城市点击选择事件
  CitySelect: function (e) {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    that.setData({
      city: e.target.dataset.name,
      CityList: !this.data.CityList,
      cover: !this.data.cover,
      ActiveCity: e.target.dataset.index,
      limit: 0
    })
    that.GetCompany(that.data.limit, that.data.sort, that.data.city, that.data.keyword)
  },

  // 点击排序
  Sort: function ( e ) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var srceen = e.currentTarget.dataset.index
    this.setData({
      ScreenActive: srceen,
      sort: srceen,
      limit: 0
    })
    this.GetCompany(this.data.limit, this.data.sort, this.data.city, this.data.keyword)
  },
  // 获取更多产品
  More: function (e) {
    var that = this
    var limit = that.data.limit + 10

    that.setData({
      limit: limit
    })

    wx.request({
      url: app.globalData.api + 'company',
      method: 'POST',
      data: {
        limit: '' + limit,
        keyword: that.data.keyword,
        city: that.data.city,
        sort: that.data.sort
      },
      success: function (e) {
        var company = that.data.company.concat(e.data.data)
        if (e.data.count == 10) {
          that.setData({
            company: company,
            NotCom: true
          })
        } else {
          that.setData({
            company: company,
            NotCom: false
          })
        }
      }
    })

  },
  // 获取公司 
  GetCompany: function( limit = 0,  sort = 1, city = '全国', keyword = '' ) {
    var that = this
    wx.request({
      url: app.globalData.api + 'company',
      method: 'POST',
      data: {
        limit: '' + limit,
        keyword: keyword,
        city: city,
        sort: sort
      },
      success: function( res ) {
        if (res.data.count == 10) {
          that.setData({
            company: res.data.data,
            NotCom: true
          })
        } else {
          that.setData({
            company: res.data.data,
            NotCom: false
          })
        }
        wx.hideLoading()
      }
    })
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
  // 公司内页跳转
  CompanyShow: function (res) {
    wx.navigateTo({
      url: '/pages/company/show/index?id=' + res.currentTarget.dataset.id
    })
  },

  // 拨打电话
  CallTel: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },

  // 查看名片
  ViewCard: function (e) {
    var that = this
    // 先查看登录用户是否已经收藏   获取结构后改变收藏按钮样式
    wx.request({
      url: app.globalData.api + 'Card/Collect?user_id=' + app.globalData.info.id + '&collect_id=' + e.currentTarget.dataset.id,
      success: function (res) {
        that.setData({
          collect: res.data.data
        })
      }
    })
    //  打开名片并赋值
    wx.request({
      url: app.globalData.api + 'Card?id=' + e.currentTarget.dataset.id + '&user_id=' + app.globalData.info.id,
      success: function (res) {
        that.setData({
          CardShow: false,
          card: res.data
        })
      }
    })
  },

  // 点击收藏
  CollectSave: function (e) {
    var that = this
    if (app.globalData.info.id) {
      wx.request({
        url: app.globalData.api + 'Card/SaveCollect?user_id=' + app.globalData.info.id + '&collect_id=' + e.currentTarget.dataset.id,
        success: function (res) {
          if (res.data.code == 200) {
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

  // 打开关闭遮盖
  Close: function () {
    this.setData({
      CardShow: !this.data.CardShow,
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
    this.GetCompany(this.data.limit, this.data.sort, this.data.city, this.data.keyword)
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