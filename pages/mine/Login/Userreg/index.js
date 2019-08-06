// pages/mine/Login/Userreg/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Company: true,
    CompanyName: '',
    Next: false,
    region: ['北京市', '北京市', '东城区'],
    address: '',
    Thumb: ''

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'WxInfo',
      success: function(e){
        that.setData({
          wxinfo: e.data
        })
      },
      fail: function( e ){
        var data = []
        data.unionid = '';
        data.headimg = '';
        that.setData({
          wxinfo:data
        })
      }
    })
    this.setData({
      mobile: options.mobile
    })
    // 设置小程序标题
    wx.setNavigationBarTitle({
      title: '用户信息填写'
    })
  },


  RegisterForm: function (e) {
    var that = this
    var FD = e.detail.value

    if (FD.nickname == '') {
      that.RegisterHint('姓名不能为空')
      return false;
    } else if (FD.email == '') {
      that.RegisterHint('邮箱不能为空')
      return false;
    } else if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(FD.email)) {
      that.RegisterHint('邮箱格式错误')
      return false;
    } else if (FD.company == '') {
      that.RegisterHint('所在单位不能为空')
      return false;
    } else if (FD.posts == '') {
      that.RegisterHint('职务不能为空')
      return false;
    } 
    FD.mobile =  that.data.mobile

    wx.request({
      url: app.globalData.api + 'Register',
      method: 'POST',
      data: FD,
      success: function (res) {
        if (res.data.code == 200) {
          that.RegisterHint(res.data.msg);
          wx.setStorage({
            key: "UserInfo",
            data: res.data.data
          })
          wx.setStorage({
            key: "Hints",
            data: 1
          })
          wx.setStorage({
            key: "Pop",
            data: 1
          })
          app.globalData.info = res.data.data
          wx.reLaunch({
            url: '/pages/mine/index'
          })
        } else if (res.data.code == 201) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success(res) {
              that.setData({
                Next: true,
                show: FD
              })
            }
          })
        } else {
          that.RegisterHint(res.data.msg);
        }
      }
    })

  },

  // 弹框提示
  RegisterHint: function (hint) {
    wx.showModal({
      title: '提示',
      content: hint,
      showCancel: false,
    })
    wx.hideLoading()
  },

  // 公司搜索
  CompanySearch: function (e) {
    var that = this

    if (e.detail.value == '') {
      that.setData({
        Company: true
      })
    }
    wx.request({
      url: app.globalData.api + 'SearchCompany?name=' + e.detail.value,
      success: function (res) {
        that.setData({
          CompanyList: res.data,
          Company: false
        })
      }
    })
  },

  // 搜索出的公司点击事件
  CompanyValue: function (e) {
    this.setData({
      CompanyName: e.currentTarget.dataset.name,
      Company: true,
    })
  },

  // 选中城市多选框后的值更改
  bindRegionChange: function (e) {
    this.setData({
      region: [e.detail.value[0], e.detail.value[1], e.detail.value[2]]
    })
  },

  // 选择地点
  ChangeAddress: function (e) {
    var that = this
    wx.authorize({
      scope: 'scope.userLocation',
      success() {

        wx.chooseLocation({
          success: function (res) {
            that.setData({
              address: res.address + res.name
            })
          }
        })

      }
    })
   
  },


  //  更换LOGO
  ChangeLogo: function (e) {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          Thumb: res.tempFilePaths
        })
      }
    })
  },

  SaveForm: function (e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this
    var XY = e.detail.value

    if (that.data.Thumb == ''){
      that.RegisterHint('请上传公司LOGO')
      return false
    } else if (XY.name == '') {
      that.RegisterHint('公司名称不能为空')
      return false;
    } else if (XY.address == '') {
      that.RegisterHint('公司详细地址不能为空')
      return false;
    }  else {
      // 上传
      wx.uploadFile({
        url: app.globalData.api + 'Mine/SaveProThumb',
        filePath: '' + that.data.Thumb,
        name: 'file',
        success: function (spon) {
          XY.thumb = spon.data
          wx.request({
            url: app.globalData.api + 'Register/NextCompany',
            data: XY,
            method: 'POST',
            success: function (res) {
              wx.hideLoading()
              that.RegisterHint(res.data.msg)
              app.globalData.info = res.data.data
              wx.setStorage({
                key: "UserInfo",
                data: res.data.data
              })
              wx.setStorage({
                key: "Hints",
                data: 1
              })
              setTimeout(function () {
                wx.reLaunch({
                  url: '/pages/mine/index'
                })
              }, 1000)
            }
          })

        }
      })
    }


  },

})