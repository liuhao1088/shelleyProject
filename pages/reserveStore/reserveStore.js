// pages/reserveStore/reserveStore.js
var bmap = require('../../utils/bmap-wx.min.js')
var util=require('../../utils/util.js')
var skip=0;
var ind;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:'',list:[]
  },

  toAddStoreInformation(event){
    wx.navigateTo({
      url: '/pages/addStoreInformation/addStoreInformation',
    })
  },
  toStoreAppointment(e){
    ind=parseInt(e.currentTarget.dataset.index)
    if(wx.getStorageSync('userInfo')){
      wx.navigateTo({
        url: '/pages/storeAppointment/storeAppointment?data='+JSON.stringify(this.data.list[ind]),
      })
    }else{
      this.selectComponent("#authorize").showModal();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          widheight: res.windowHeight,
          scrollHev: res.windowHeight - (res.windowWidth/750)*120
        });
      }
    });
    var BMap = new bmap.BMapWX({
      ak: 'yLnHh2rGyFiou5kZGVMtP0LLKWrXfr0i'
    });
    wx.getLocation({
      success (res) {
        console.log(res)
        const lat = res.latitude
        const lon = res.longitude
        BMap.regeocoding({
          location:lat + ',' + lon,
          success: function (res) { 
            console.log(res)
            that.setData({address:res.originalData.result.business})
          },
          fail: function (r) {
            console.log(r)
            wx.showToast({
              title: '请检查位置服务是否开启',
            })
           },
        });
        skip=0;
        that.loadData();
      }
    })
  },
  loadData:function(){
    var that=this;
    wx.showLoading({
      title: '加载中',
    })
    var stamp=Date.parse(util.formatTime(new Date()).replace(/-/g, '/')) / 1000;
    console.log(stamp)
    var _=wx.cloud.database().command;
    wx.cloud.callFunction({
      name: 'screenQuery',
      data: {
        collection: 'activity',
        match: {type:'reservation'},
        stamp:stamp,
        or: [{}],
        and: [{}],
        lookup: {
          from: 'shop',
          localField: 'shop_code',
          foreignField: 'shop_code',
          as: 'shop',
        },
        lookup2: {
          from: 'reservation',
          localField: '_id',
          foreignField: 'act_id',
          as: 'reservation',
        },
        sort: {
          creation_date: -1
        },
        skip: skip,
        limit: 10
      }
    }).then(res => {
      console.log(res)
      let data=that.data.list.concat(res.result.list);
      if(res.result.list.length==0) wx.showToast({title:'暂无更多数据',icon:'none'})
      that.setData({list:data})
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
        })
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
    var that=this;
    if (wx.getStorageSync('refreshData')) {
      let data = wx.getStorageSync('refreshData');
      let list=that.data.list;
      list[ind].reservation=['has'];
      that.setData({list:list})
      wx.removeStorageSync('refreshData')
    }
  },
  bindDownLoad: function () {
    wx.showNavigationBarLoading() 
    skip = skip + 10;
    this.loadData()
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