// pages/activityDetails/activityDetails.js
var app = getApp();
var util = require('../../utils/util.js')
var skip = 0;
var code;
var id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    stamp: Date.parse(util.formatTime(new Date()).replace(/-/g, '/')) / 1000,
    search_whether: false,
    search: '',
    transmit: false,
    blist:[],
    isOpen: false,
  },
  toActivitySelect(event) {
    switch (code) {
      case 'all':
        wx.navigateTo({
          url: '/pages/activitySelect/activitySelect?data=' + 'parse',
        })
        break;
      default:
        wx.navigateTo({
          url: '/pages/activitySelect/activitySelect',
        })
    }

  },

   // 开关
  selSwitch(e){
    var ind = e.currentTarget.dataset.index;
    let data =  this.data.blist;
    if(data[ind].type=='team'){
      data[ind].team_using=!data[ind].team_using
      wx.cloud.callFunction({
        name:'recordUpdate',
        data:{
          collection:'shop',
          where:{
            _id:id
          },
          updateData:{
            team_using:data[ind].team_using
          }
        }
      })
    }else{
      data[ind].re_using=!data[ind].re_using
      wx.cloud.callFunction({
        name:'recordUpdate',
        data:{
          collection:'shop',
          where:{
            _id:id
          },
          updateData:{
            re_using:data[ind].re_using
          }
        }
      })
    }
		this.setData({
		  blist:data
		})
	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          widheight: res.windowHeight,
          scrollHev: res.windowHeight - (res.windowWidth / 750) * 100,
          stamp: Date.parse(util.formatTime(new Date()).replace(/-/g, '/')) / 1000
        });
      }
    });
    skip = 0;
    let userInfo = wx.getStorageSync('userInfo')
    code = userInfo.shop[userInfo.shop.length - 1].shop_code;
    if (options.data) {
      code = 'all'
      that.setData({transmit:true})
    }else{
      let team_using=false;
      let re_using=false;
      wx.cloud.database().collection('shop').where({_openid:app.globalData.openid}).orderBy('creation_date','desc').skip(0).limit(1).get().then(res=>{
        let shop=res.data[0]
        id=shop._id;
        if(shop.team_using){
          team_using=shop.team_using
        }
        if(shop.re_using){
          re_using=shop.re_using
        }
        wx.cloud.database().collection('activity').where({shop_code:'all',type:'team'}).orderBy('creation_date','desc').skip(0).limit(1).get().then(res=>{
          let blist=res.data;
          blist[0].team_using=team_using;
          wx.cloud.database().collection('activity').where({shop_code:'all',type:'reservation'}).orderBy('creation_date','desc').skip(0).limit(1).get().then(res=>{
            res.data[0].re_using=re_using;
            blist=blist.concat(res.data)
            that.setData({blist:blist})
          })
        })
      })
    }
    that.loadData();
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  inputSearch: function (e) {
    this.setData({
      search: e.detail.value
    })
  },
  toSearch: function () {
    if (this.data.search !== '') {
      var that = this;
      var _ = wx.cloud.database().command;
      let search = that.data.search;
      if (search == '预约' || search == '预约活动') {
        search = 'reservation'
      }
      if (search == '拼团' || search == '拼团活动') {
        search = 'team'
      }
      wx.cloud.database().collection('activity').where({
        shop_code: code
      }).where(_.or([{
        act_code: {
          $regex: '.*' + that.data.search,
          $options: 'i'
        }
      }, {
        title: {
          $regex: '.*' + that.data.search,
          $options: 'i'
        }
      }, {
        type: {
          $regex: '.*' + search,
          $options: 'i'
        }
      }])).orderBy('creation_date', 'desc').get().then(res => {
        if (res.data.length == 0) {
          that.setData({
            searchlist: [],
            search_whether: false
          })
          wx.showToast({
            title: '活动不存在',
            icon: 'none',
            duration: 1500
          })
        } else {
          let data = res.data
          that.setData({
            searchlist: data,
            search_whether: true
          })
        }
      })
    } else {
      this.setData({
        searchlist: [],
        search_whether: false
      })
      wx.showToast({
        title: '预约单号不存在',
        icon: 'none',
        duration: 1500
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let data = wx.getStorageSync('refresh')
    console.log(data)
    if (wx.getStorageSync('refresh')) {
      setTimeout(() => {
        skip = 0;
        this.setData({
          list: []
        })
        this.loadData();
        wx.removeStorageSync('refresh')
      }, 500);
    }
  },
  loadData: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var _ = wx.cloud.database().command;
    wx.cloud.database().collection('activity').where({
      shop_code: code
    }).orderBy('creation_date', 'desc').skip(skip).limit(10).get().then(res => {
      let data = that.data.list.concat(res.data)
      if (res.data.length == 0) {
        wx.showToast({
          title: '暂无更多数据',
          icon: 'none',
          duration: 1000
        })
      }
      that.setData({
        list: data
      })
      if (that.data.list.length == 0) {
        
      }
      wx.hideLoading()
      wx.hideNavigationBarLoading()
    })
  },
  async bindDownLoad() {
    wx.showNavigationBarLoading()
    skip = skip + 10;
    await this.loadData()
  },
  toEdit: function (e) {
    var ind = e.currentTarget.dataset.index;
    if (this.data.list[ind].type == 'team') {
      wx.navigateTo({
        url: '../groupActivities/groupActivities?data=' + JSON.stringify(this.data.list[ind]),
      })
    } else {
      wx.navigateTo({
        url: '../reservationActivity/reservationActivity?data=' + JSON.stringify(this.data.list[ind]),
      })
    }
  },
  toLookup: function (e) {
    var ind = e.currentTarget.dataset.index;
    if (this.data.blist[ind].type == 'team') {
      wx.navigateTo({
        url: '../brandGroupActivity/brandGroupActivity?data=' + JSON.stringify(this.data.blist[ind]),
      })
    } else {
      wx.navigateTo({
        url: '../brandReservationActivity/brandReservationActivity?data=' + JSON.stringify(this.data.blist[ind]),
      })
    }
  },
  delete: function (e) {
    var _this = this;
    var ind = e.currentTarget.dataset.index;
    let title = _this.data.list[ind].title.substring(0, 4) + '...'
    wx.showModal({
      title: '是否删除活动' + title,
      content: '删除后不可恢复，请慎重考虑',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中',
          })
          wx.cloud.callFunction({
            name: 'recordDelete',
            data: {
              collection: 'activity',
              where: {
                _id: _this.data.list[ind]._id
              }
            }
          }).then(res => {
            console.log(res)
            let list = _this.data.list;
            list.splice(ind, 1)
            skip = skip - 1;
            _this.setData({
              list: list
            })
            wx.hideLoading({
              success: (res) => {},
            })
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000
            })
          })
        }
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