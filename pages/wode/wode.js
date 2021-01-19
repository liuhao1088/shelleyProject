var app = getApp();
var util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    userInfo: {
      type: 'driver',
      nickName: '用户',
      avatarUrl: ''
    },
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
    newMsg: 0,
    prize: false,
    posterImg: [
      'https://img10.360buyimg.com/ddimg/jfs/t1/152563/16/14632/154080/5ffe5234Ef203ada0/78ad42bb28dba617.jpg',
      'https://img14.360buyimg.com/ddimg/jfs/t1/166688/37/1598/104678/5ff7cf5bEb402e7cf/f01242efb00089f2.png',
      'https://img10.360buyimg.com/ddimg/jfs/t1/152563/16/14632/154080/5ffe5234Ef203ada0/78ad42bb28dba617.jpg',
      'https://img14.360buyimg.com/ddimg/jfs/t1/166688/37/1598/104678/5ff7cf5bEb402e7cf/f01242efb00089f2.png',
    ],
    cardCur: 0,
  },
  toMyCoupon() {
    if (!wx.getStorageSync('userInfo')) {
      this.selectComponent("#authorize").showModal();
      this.retrieval()
    } else {
      wx.navigateTo({
        url: '/pages/myCoupon/myCoupon',
      })
    }
  },
  toAddStoreInformation() {
    wx.navigateTo({
      url: '/pages/addStoreInformation/addStoreInformation',
    })
  },
  toCarAppointment() {
    wx.navigateTo({
      url: '/pages/carAppointment/carAppointment',
    })
  },
  toMyStore() {
    wx.navigateTo({
      url: '/pages/myStore/myStore',
    })
  },
  toAllstore() {
    wx.navigateTo({
      url: '/pages/allStore/allStore',
    })
  },
  toActivityDetails() {
    wx.navigateTo({
      url: '/pages/activityDetails/activityDetails?data=' + 'parse',
    })
  },
  toHelpAndFeedback() {
    wx.navigateTo({
      url: '/pages/helpAndFeedback/helpAndFeedback',
    })
  },
  toCommonProblem() {
    wx.navigateTo({
      url: '/pages/commonProblem/commonProblem',
    })
  },

  toMessageCenter() {
    if (!wx.getStorageSync('userInfo')) {
      this.selectComponent("#authorize").showModal();
      this.retrieval()
    } else {
      wx.navigateTo({
        url: '/pages/messageCenter/messageCenter',
      })
    }
  },

  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },

  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
    //console.log(this.data.cardCur)
  },

  getSwiper(e){
    let id = e.currentTarget.id;
    console.log(id)
    if (id === '0' || id === '2') {
      wx.navigateTo({
        url: '/pages/groupSpecial/groupSpecial',
      })
    }else{
      wx.navigateTo({
        url: '/pages/rOne/rOne',
      })
    }
  },

  //弹窗
  showModal(e) {
    let that = this;
    let target = e.currentTarget.dataset.target;
    let ind = e.currentTarget.dataset.index;
    that.setData({
      waresInd: ind
    })
    if (target === 'goGroupSuccess') {
      wx.showLoading({
        title: '加载中...',
      })
      setTimeout(function () {
        that.setData({
          modalName: target
        })
        wx.hideLoading({
          success: (res) => {},
        })
      }, 1000)

    } else {
      that.setData({
        modalName: target
      })
    }
  },
  hideModal(e) {
    this.setData({
      modalName: null,
    })
  },
  // 多选
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
        bottom:'140rpx'
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
  async onShow() {
    if (wx.getStorageSync('userInfo')) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo
      })
      console.log(userInfo)
    }
    var _t = this
    switch (wx.getStorageSync('userInfo') !== '') {
      case true:
        wx.cloud.database().collection('message').where({
          _openid: app.globalData.openid,
          read: 'unread'
        }).count({
          success: function (res) {
            _t.setData({
              newMsg: res.total
            })
          }
        })
        let bln;
        await util.inspect().then(res=>{
          bln=res
        })
        switch(bln){
          case true:
            _t.setData({prize:bln})
            break;
        }
        break;
    }
  },

  toSign: function () {
    if (!wx.getStorageSync('userInfo')) {
      this.selectComponent("#authorize").showModal();
      this.retrieval()
    }
  },
  async getCoupon(){
    var that=this;
    await util.getCoupon(this.data.checkbox)
    that.setData({modalName:null,prize:false})
  },
  async retrieval() {
    var that = this;
    let timing = setInterval(async () => {
      if (wx.getStorageSync('userInfo')) {
        let userInfo=wx.getStorageSync('userInfo')
        this.setData({userInfo:userInfo})
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.from)
      return {
        title: "大品牌，好未来！", //分享标题
        imageUrl: 'https://img10.360buyimg.com/ddimg/jfs/t1/148055/20/20623/109199/5fe94a22E2aeac6fb/f5ba90fc9d52fc06.png', //图片路径
        path: 'pages/index/index'
      }
    } else {
      return {
        title: "大品牌，好未来！", //标题
        imageUrl: 'https://img10.360buyimg.com/ddimg/jfs/t1/148055/20/20623/109199/5fe94a22E2aeac6fb/f5ba90fc9d52fc06.png', //图片路径
        path: '/page/index/index'
      }
    }
  }
})