var app = getApp();
var bmap = require('../../utils/bmap-wx.min.js')
var util = require('../../utils/util.js')
var skip = 0;
var ind;
var shop_data;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '',
    list: [],
    tabbar: {},
    lon:'',
    lat:''
  },

  toAddStoreInformation(event) {
    wx.navigateTo({
      url: '/pages/addStoreInformation/addStoreInformation',
    })
  },
  toStoreAppointment(e) {
    ind = parseInt(e.currentTarget.dataset.index)
    if (wx.getStorageSync('userInfo')) {
      wx.navigateTo({
        url: '/pages/storeAppointment/storeAppointment?data=' + JSON.stringify(this.data.list[ind]),
      })
    } else {
      this.selectComponent("#authorize").showModal();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
    var that = this;
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          widheight: res.windowHeight,
          scrollHev: res.windowHeight - (res.windowWidth / 750) * 120
        });
      }
    });
    var BMap = new bmap.BMapWX({
      ak: 'yLnHh2rGyFiou5kZGVMtP0LLKWrXfr0i'
    });
    wx.getLocation({
      success(res) {
        console.log(res)
        const lat = res.latitude
        const lon = res.longitude
        BMap.regeocoding({
          location: lat + ',' + lon,
          success: function (res) {
            console.log(res)
            that.setData({
              address: res.originalData.result.business,
              lon:lon,
              lat:lat
            })
          },
          fail: function (r) {
            console.log(r)
            wx.showToast({
              title: '请检查位置服务是否开启',
            })
          },
        });
        skip = 0;
        that.loadData(lat, lon);
      }
    })
    switch(app.globalData.wares){
      case '':
        wx.cloud.callFunction({
          name: 'showwares'
        }).then(res => {
          console.log(res)
          app.globalData.wares = res.result;
        })
        break;
    }
  },
  loadData: function (lat, lon) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var stamp = Date.parse(util.formatTime(new Date()).replace(/-/g, '/')) / 1000;
    var _ = wx.cloud.database().command;
    wx.cloud.callFunction({
      name: 'recordQuery',
      data: {
        collection: 'shop',
        where: {
          prove: 'success'
        },
        from: 'activity',
        let: {
          shop_code: '$shop_code',
        },
        match: ['$shop_code', '$$shop_code'],
        matchs: ['$type', 'reservation'],
        project: {
          shop_code: 0
        },
        as: 'act',
        from2: 'reservation',
        let2: {
          shop_code: '$shop_code',
        },
        match2: ['$shop_code', '$$shop_code'],
        matchs2: ['$_openid', app.globalData.openid],
        project2: {
          shop_code: 0
        },
        as2: 're',
        sort: {
          creation_timestamp: -1
        },
        skip: skip,
        limit: 100
      }
    }).then(res => {
      let data = that.data.list.concat(res.result.list);
      if (res.result.list.length == 0) wx.showToast({
        title: '暂无更多数据',
        icon: 'none'
      })
      if (data.length == 0) wx.showToast({
        title: '附近暂无门店',
        icon: 'none',
        duration: 10000000
      })
      for (let i in data) {
        data[i].distance = util.getDistance(lat, lon, data[i].lat, data[i].lon)
        if (data[i].act.length > 0) {
          if (stamp < data[i].act[0].end_timestamp) {
            data[i].gift = true;
          }
        }
        if (i == data.length - 1) {
          data.sort(util.compare("distance"));
          shop_data = data;
          let list = data.slice(0, 9)
          that.setData({
            list: list
          })
        }
      }
      wx.hideLoading()
      wx.hideNavigationBarLoading()
    })
  },
  
  chooseLocation: function (e) {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          address: res.name,
          list:[],
          lon:res.longitude,
          lat:res.latitude
        })
        skip=0;
        that.loadData(res.latitude,res.longitude)
      },
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
    var that = this;
    if (wx.getStorageSync('refreshData')) {
      let data = wx.getStorageSync('refreshData');
      let list = that.data.list;
      list[ind].reservation = ['has'];
      that.setData({
        list: list
      })
      wx.removeStorageSync('refreshData')
    }
  },
  async bindDownLoad() {
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '加载中',
      duration: 500
    })
    skip = skip + 10;
    if(skip==100){ 
      await this.loadData(this.data.lat,this.data.lon) 
    } 
    let list = shop_data.slice(0 + skip, 9 + skip)
    if (list.length == 0) wx.showToast({
      title: '暂无更多数据',
      icon: 'none',
      duration: 2000
    })
    let data = this.data.list.concat(list)
    this.setData({
      list: data
    })
    wx.hideNavigationBarLoading()
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
  // onShareAppMessage: function () {

  // }
})