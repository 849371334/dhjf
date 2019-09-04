var app = getApp()
let SSID = 'Chinanx'
let password = 'nx123456'
Page({
  data: {
    address: '',
    latitude: app.globalData.latitude,
    longitude: app.globalData.longitude,
    wifiTitle: '',
    markers: [{
      iconPath: "../../img/marker_red.png",
      id: 0,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
      width: 17,
      height: 20
    }],
  },
  //这里触发map里controltap事件
  controltap: function () {
    this.mapCtx.moveToLocation()
  },
  onLoad: function () {
    this.getCenterLocation()
    this.connectWifi()
  },
  getCenterLocation: function () {
    var that = this
      wx.getLocation({
        type: 'gcj02',
        success(res) {
          var currentLatitude = (res.latitude).toFixed(6);
          var currentLongitude = (res.longitude).toFixed(6);
          app.globalData.longitude = currentLongitude
          app.globalData.latitude = currentLatitude
          that.setData({latitude: currentLatitude, longitude: currentLongitude })
          var getAddressUrl = app.globalData.mapUrl + currentLatitude + "," + currentLongitude + app.globalData.mapKey;
          wx.request({
            url: getAddressUrl,
            success: function (result) {
              that.setData({address: result.data.result.formatted_addresses.recommend,markers: [{latitude: currentLatitude,longitude: currentLongitude}]})
            }
          })
        }
    })
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  connectWifi: function () {
    var that = this;
    //检测手机型号
    wx.getSystemInfo({
      success: function (res) {
        var system = '';
        if (res.platform == 'android') system = parseInt(res.system.substr(8));
        if (res.platform == 'ios') system = parseInt(res.system.substr(4));
        if (res.platform == 'android' && system < 6) {
          wx.showToast({
            title: '手机版本不支持',
          })
          return
        }
        if (res.platform == 'ios' && system < 11.2) {
          wx.showToast({
            title: '手机版本不支持',
          })
          return
        }
        that.startWifi();
      }
    })
  },
  startWifi: function () {
    var that = this
    wx.startWifi({
      success: function () {
        wx.getConnectedWifi({
          success: function (res) {
             that.setData({ wifiTitle: res.wifi.SSID})
          },
          fail: function (err) {
            that.Connected(that)
          }
        })
      },
      fail: function (res) {
        that.Connected(that)
      }
    })
  },
  //连接wifi
  Connected: function (_this) {
    wx.connectWifi({
      SSID:SSID,
      password:password,
      success: function (res) {
        _this.setData({ wifiTitle: SSID })
        wx.showModal({
          title: 'WIFI',
          content: 'wifi连接成功!',
        })
      },
      fail: function (res) {
        wx.showModal({
          title: 'WIFI',
          content: '请手动连接WIFI!',
        })
      }
    })
  }
})

