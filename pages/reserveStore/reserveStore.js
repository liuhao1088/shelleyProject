var app = getApp();
var bmap = require('../../utils/bmap-wx.min.js')
var util = require('../../utils/util.js')
var skip = 0;
var ind;
var shop_data;
let pro = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '',
    list: [],
    tabbar: {},
    lon: '',
    lat: '',
    loadProgress: 0,
    complete: false,
    hiddenFlag:true
  },
  toAddStoreInformation(event) {
    wx.navigateTo({
      url: '/pages/addStoreInformation/addStoreInformation',
    })
  },
  toStoreAppointment(e) {
    ind = parseInt(e.currentTarget.dataset.index)
    let list = this.data.list[ind];
    if (wx.getStorageSync('userInfo')) {
      wx.navigateTo({
        url: '/pages/storeAppointment/storeAppointment?data=' + JSON.stringify(list),
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
    let model = app.globalData.systemInfo.model;
    let isIphoneX = model.search('iPhone X') != -1 ? true : false;
    let isIphone11 = model.search('iPhone 11') != -1 ? true : false;
    let isIphone12 = model.search('iPhone 12') != -1 ? true : false;
    console.log(model);
    this.selectComponent("#getJudgment").getJudgment(isIphoneX,isIphone11,isIphone12);
    if(isIphoneX === true || isIphone11 === true || isIphone12 === true){
      this.setData({
        bottom:'220rpx'
      })
    }else{
      this.setData({
        bottom:'160rpx'
      })
    }
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
    wx.cloud.database().collection('activity').where({shop_code:'all',type:'reservation'}).orderBy('creation_date','desc').skip(0).limit(1).get().then(res=>{
      let data=res.data;
      wx.setStorageSync('brand_re', data)
    })
    do {
      that.loadProgress(pro)
      pro++;
    } while (pro < 95)
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
              address: res.originalData.result.formatted_address,
              lon: lon,
              lat: lat
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
    switch (app.globalData.wares) {
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
    if (pro >= 100) {
      pro = 0;
    }
    do {
      that.loadProgress(pro)
      pro++;
    } while (pro < 95)
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
      if (res.result.list.length == 0) {
        that.loadProgress(100)
        that.setData({
          complete: true
        })
        wx.showToast({
          title: '暂无更多数据',
          icon: 'none'
        })
      } else {
        do {
          that.loadProgress(pro)
          pro = pro + 3;
        } while (pro < 100)
        for (let i in data) {
          data[i].distance = util.getDistance(lat, lon, data[i].lat, data[i].lon)
          if (data[i].act.length > 0) {
            if (stamp < data[i].act[0].end_timestamp) {
              data[i].gift = true;
            }
          }
          if (i == data.length - 1) {
            that.loadProgress(100)
            that.setData({
              complete: true
            })
            data.sort(util.compare("distance"));
            data.forEach((item, ind, arr) => {
              item.bg = util.bgimg()[ind % 4];
            })
            shop_data = data;
            let list = data.slice(0, 9)
            that.setData({
              list: list
            })
          }
        }
      }
      if (data.length == 0) {
        that.loadProgress(100)
        that.setData({
          complete: true
        })
        wx.showToast({
          title: '附近暂无门店',
          icon: 'none',
          duration: 10000000
        })
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
          address: res.address,
          list: [],
          lon: res.longitude,
          lat: res.latitude
        })
        skip = 0;
        that.loadData(res.latitude, res.longitude)
      },
    })
  },
  loadProgress() {
    this.setData({
      loadProgress: pro
    })
    if (this.data.loadProgress >= 100) {
      this.setData({
        loadProgress: 0
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
    var that = this;
    if (wx.getStorageSync('refreshData')) {
      // let data = wx.getStorageSync('refreshData');
      let list = that.data.list;
      
      list[ind].reservation = ['has'];
      that.setData({
        list: list
      })
      wx.removeStorageSync('refreshData')
    }
  },
  async bindDownLoad() {

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
  async onReachBottom() {
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '加载中',
      duration: 500
    })
    skip = skip + 10;
    if (skip == 100) {
      await this.loadData(this.data.lat, this.data.lon)
    }
    let list = shop_data.slice(0 + skip, 9 + skip)
    if (list.length == 0) {
      this.setData({
        hiddenFlag:false
      })
    }
    let data = this.data.list.concat(list)
    this.setData({
      list: data
    })
    console.log(this.data.list)
    wx.hideNavigationBarLoading()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})