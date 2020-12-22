// pages/groupSpecial/groupSpecial.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList: [{
        img: '',
        name: '微信头像1',
        time: '00:09:25'
      },
      {
        img: '',
        name: '微信头像2',
        time: '00:40:25'
      },
      {
        img: '',
        name: '微信头像3',
        time: '00:32:25'
      }
    ],
    checkbox: [{
      id: 0,
      name: '行车记录仪',
      checked: false,
    }, {
      id: 1,
      name: '专车专用记录仪',
      checked: false,
    }, {
      id: 2,
      name: '智能车机',
      checked: false,
    }, {
      id: 3,
      name: '隐形车衣',
      checked: false,
    }],
    nowDate:'2020-12-22 18:00:00',//结束时间
    countdown:'', //倒计时
    day:'',//天
    hou:'',//时
    min:'',//分
    sec:'',//秒
  },
  toActivityRule(event) {
    wx.navigateTo({
      url: '/pages/activityRule/activityRule',
    })
  },
  toMyCoupon(event) {
    wx.navigateTo({
      url: '/pages/myCoupon/myCoupon',
    })
    this.hideModal();
  },
  toReserveStore(e){
    wx.navigateTo({
      url: '/pages/reserveStore/reserveStore',
    })
    this.setData({
      modalName: null
    })
  },

  //弹窗
  showModal(e) {
    let that = this;
    let target = e.currentTarget.dataset.target;
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
      modalName: null
    })
  },

  goGroupSuccessModal(e) {

  },
  // 多选
  ChooseCheckbox(e) {
    console.log(e)
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

  //倒计时
  countTime() {
    let nowDate = this.data.nowDate;
    console.log(nowDate)
    let that = this;
    let now = new Date().getTime();
    let end = new Date(nowDate).getTime(); //设置截止时间
    console.log("开始时间："+now,"截止时间:"+end);
    let leftTime =  end -now;//时间差                         
    let day,hou, min, sec;
    if (leftTime >= 0) {
      day = Math.floor(leftTime / 1000 / 60 / 60 / 24);
      hou = Math.floor(leftTime / 1000 / 60 / 60 % 24);
      min = Math.floor(leftTime / 1000 / 60 % 60);
      sec = Math.floor(leftTime / 1000 % 60);
      day = day < 10? "0" + day:day
      sec = sec < 10 ? "0" + sec : sec
      min = min < 10 ? "0" + min : min
      hou = hou < 10 ? "0" + hou : hou
      that.setData({
        countdown: hou+":"+min+":"+sec,
        day,
        hou,
        min,
        sec
      })
      //递归每秒调用countTime方法，显示动态时间效果
      setTimeout(that.countTime, 1000);
    } else {
      that.setData({
        countdown: '已截止'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.countTime();
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
  onShareAppMessage: function (options) {

    return {
      title: "【仅剩1个名额】我领了100元拼团券，快来助我成团激活~", //分享标题
      imageUrl: 'https://img13.360buyimg.com/ddimg/jfs/t1/121210/17/18389/166336/5faca14cE7949307a/1da2d6b96122e01d.jpg', //图片路径
      path: '/page/groupSpecial/groupSpecial'
    }
  }
})