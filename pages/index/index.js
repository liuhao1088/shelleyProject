// pages/wode/wode.js
var app = getApp();
var util=require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
  },
  togroupSpecial() {
    wx.navigateTo({
      url: '/pages/groupSpecial/groupSpecial',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          if(!wx.getStorageSync('userInfo')){
            this.selectComponent("#authorize").showModal();
          }
        } else {
          //打开授权登录页
          this.selectComponent("#authorize").showModal();
        }
      }
    })
    util.nearby();
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
    if (wx.getStorageSync('userInfo')) {
      let userInfo = wx.getStorageSync('userInfo')
      /*if(wx.getStorageSync('prize')){
        wx.cloud.database().collection('coupon').where({_openid:userInfo._openid,shop_code:'all'}).get().then(res=>{
          let data=res.data;
          wx.setStorageSync('prize', data)
          if(data.length==0){
            that.setData({modalName:0})
          }
        }) 
      }*/
      wx.cloud.callFunction({
        name: 'multQuery',
        data: {
          collection: 'user',
          match: {
            _openid: userInfo._openid
          },
          or: [{}],
          and: [{}],
          lookup: {
            from: 'shop',
            localField: '_openid',
            foreignField: '_openid',
            as: 'shop',
          },
          lookup2: {
            from: 'coupon',
            localField: '_openid',
            foreignField: '_openid',
            as: 'coupon',
          },
          sort: {
            creation_date: -1
          },
          skip: 0,
          limit: 1
        }
      }).then(res => {
        let user = res.result.list[0];
        console.log(user)
        wx.setStorageSync('userInfo', user)
        /*if(user.type=='shopkeeper'){
          wx.cloud.database().collection('reservation').where({shop_code: userInfo.shop[userInfo.shop.length-1].shop_code,status:'waiting'}).count({
            success: function (res) {
              if(res.total>0){
                that.setData({re_count:res.total})
              }
            }
          })
        }*/
      })
      /*wx.cloud.database().collection('coupon').where({_openid: userInfo._openid,status:'success'}).count({
        success: function (res) {
          if(res.total>0){
            that.setData({coupon_count:res.total})
          }
        }
      })*/
    }
  },
  toManage: function () {
    if (!wx.getStorageSync('userInfo')) {
      this.selectComponent("#authorize").showModal();
    } else {
      let openid = wx.getStorageSync('userInfo')._openid;
      wx.cloud.database().collection('user').where({
        _openid: openid
      }).get().then(res => {
        if (res.data[0].authority == 'admin') {
          wx.navigateTo({
            url: '/pages/manage/manage',
          })
        }
      })
    }
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
  retrieval: function () {
    var that = this;
    let timing = setInterval(() => {
      if (wx.getStorageSync('userInfo')) {
        let userInfo = wx.getStorageSync('userInfo')
        wx.cloud.database().collection('coupon').where({_openid:userInfo._openid,shop_code:'all'}).get().then(res=>{
          let data=res.data;
          wx.setStorageSync('prize', data)
          if(data.length==0){
            that.setData({modalName:0})
          }
        })
        setTimeout(() => {
          clearInterval(timing);
        }, 900);
      }
    },1000)
  },
  
  getCoupon:function(){
    var that=this;
    let userInfo=wx.getStorageSync('userInfo')
    wx.showLoading({
      title: '领取中'
    })
    let code;
    for (let e = 0; e < 10; e++) {
      code += Math.floor(Math.random() * 10)
    }
    wx.cloud.callFunction({
      name: 'recordAdd',
      data: {
        collection: 'coupon',
        addData: {
          creation_date: util.formatTimes(new Date()),
          creation_timestamp: Date.parse(util.formatTimes(new Date()).replace(/-/g, '/')) / 1000,
          end_date:util.nextYear(new Date()),
          end_timestamp: Date.parse(util.nextYear(new Date()).replace(/-/g, '/')) / 1000,
          _openid: userInfo._openid,
          cou_code:code,
          act_id:'-1',
          user: userInfo.nickName,
          shop_code:'all',
          shopping: {name:'全品类商品',price:'0',original_price:'100'},
          status: 'success'
        }
      }
    }).then(res => {
      wx.hideLoading()
      wx.showToast({
        title: '领取成功',
        icon:'success',
        duration:1500
      })
      let device=[]
      for(let i=0;i<that.data.checkbox.length;i++){
        if(that.data.checkbox[i].checked==true){
          device.push(that.data.checkbox[i].name)
        }
        if(i+1==that.data.checkbox.length){
          wx.cloud.callFunction({
            name: 'recordAdd',
            data: {
              collection: 'device',
              addData: {
                creation_date: util.formatTimes(new Date()),
                creation_timestamp: Date.parse(util.formatTimes(new Date()).replace(/-/g, '/')) / 1000,
                _openid: userInfo._openid,
                user: userInfo.nickName,
                device:device
              }
            }
          }).then(res => {})
        }
      }
      wx.setStorageSync('prize', [{status:'success',cou_code:code,act_id:'-1'}])
      let count=that.data.coupon_count;
      that.setData({coupon_count:count+1,modalName:null})
    }).catch(error => {
      wx.hideLoading({
        success: (res) => {},
      })
      wx.showModal({
        showCancel: false,
        title: '系统繁忙，请稍后重试'
      })
    })
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