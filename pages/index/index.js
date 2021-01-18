// pages/wode/wode.js
var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    checkbox: [{
        id: 0,
        name: '行车记录仪',
        checked: false,
      }, {
        id: 1,
        name: '隐形车衣',
        checked: false,
      }, {
        id: 2,
        name: '360全景',
        checked: false,
      },
      {
        id: 3,
        name: '导航车机',
        checked: false,
      },
      {
        id: 4,
        name: '汽车音响',
        checked: false,
      },
      {
        id: 5,
        name: '汽车美容',
        checked: false,
      }
    ],
    bottom: '',
    isIphoneX: false
  },
  togroupSpecial() {
    if(wx.getStorageSync('userInfo')){
      wx.navigateTo({
        url: '/pages/groupSpecial/groupSpecial',
      })
    }else{
      this.selectComponent("#authorize").showModal();
      this.retrieval()
    }
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  // 服务多选
  ChooseCheckbox(e) {
    let items = this.data.checkbox;
    let id = e.currentTarget.id;
    console.log(id)
    for (let i = 0; i < items.length; ++i) {
      if (items[i].id == id) {
        console.log(items[i].id)
        items[i].checked = !items[i].checked;
        break
      }
    }
    this.setData({
      checkbox: items
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    app.editTabbar();

    let model = app.globalData.systemInfo.model;
    let isIphoneX = model.search('iPhone X') != -1 ? true : false;
    let isIphone11 = model.search('iPhone 11') != -1 ? true : false;
    let isIphone12 = model.search('iPhone 12') != -1 ? true : false;
    console.log(model);
    this.selectComponent("#getJudgment").getJudgment(isIphoneX,isIphone11,isIphone12);
    if (isIphoneX === true || isIphone11 === true || isIphone12 === true) {
      this.setData({
        bottom: '250rpx'
      })
    } else {
      this.setData({
        bottom: '180rpx'
      })
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          if (!wx.getStorageSync('userInfo')) {
            this.selectComponent("#authorize").showModal();
            this.retrieval()
          }
        } else {
          //打开授权登录页
          this.selectComponent("#authorize").showModal();
          this.retrieval()
        }
      }
    })
    util.nearby();
    if(wx.getStorageSync('userInfo')){
      let bln;
      await util.inspect().then(res => {
        bln = res
      })
      switch (bln) {
        case true:
          this.setData({
            modalName: 'question',
            prize: bln
          })
          break;
      }
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
    if (wx.getStorageSync('userInfo')) {
      let userInfo = wx.getStorageSync('userInfo')
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
      })
    }
  },

  async getCoupon() {
    var that = this;
    await util.getCoupon(this.data.checkbox)
    that.setData({
      modalName: null,
      prize: false
    })
  },

  //检索是否登陆
  async retrieval() {
    var that = this;
    let timing = setInterval(async () => {
      if (wx.getStorageSync('userInfo')) {
        let bln;
        await util.inspect().then(res=>{
          bln=res
        })
        switch(bln){
          case true:
            this.setData({prize:bln,modalName:'question'})
            break;
        }
        setTimeout(() => {
          clearInterval(timing);
        }, 900);
      }
    }, 1000);
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