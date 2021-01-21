// pages/storeAppointment/storeAppointment.js
var app = getApp();
var util = require('../../utils/util.js');
var timer;
let flag;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkbox: [],
    nameList: ['请选择想要体验的商品，可多选'],
    data: '',
    firstLoading: true,
    isShow: false,
    reservation: '',
    ind: 0,
    startTime: "2021-01-20 12:30",
    multiArray: [
      [],
      [],
    ],
    multiIndex: [0, 0],
  },
  changeStartTime(e) {
    let time = util.formatTime(new Date());//当前时间
    this.setData({
      startTime: e.detail.value
    })
    let startTime = this.data.startTime;//到店时间
    flag =  this.compareDate(time,startTime);
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    let nameList = [];
    let items = this.data.checkbox;
    for (let i = 0; i < items.length; i++) {
      if (items[i].checked == true) {
        nameList.push(items[i].name);
      }
    }
    if (nameList == '') {
      nameList = ['请选择想要体验的商品，可多选']
    }
    this.setData({
      modalName: null,
      nameList
    })
    if (wx.getStorageSync('phone')) {
      this.setData({
        isShow: false
      })
    }
    console.log(nameList)
  },
  ChooseCheckbox(e) {
    let items = this.data.checkbox;
    let ind = e.currentTarget.dataset.index;
    items[ind].checked = !items[ind].checked;
    this.setData({
      checkbox: items,
      ind: ind
    })
  },

  //日期大小比较
  compareDate(date1, date2) {
    var oDate1 = new Date(date1);//当前时间
    var oDate2 = new Date(date2);//到店时间
    console.log("当前时间："+oDate1.getTime(),"到店时间："+oDate2 )
    if (oDate1.getTime() >= oDate2.getTime()) {
      return true; //第一个大
    } else {
      return false; //第二个大
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      startTime: '请选择到店时间'
    })

    let flag = app.globalData.flag;
    console.log(flag)
    this.setData({
      flag
    })



    if (options.data) {
      let data = JSON.parse(options.data)
      let list = data.re;
      let stamp = Date.parse(util.formatTime(new Date()).replace(/-/g, '/')) / 1000;
      if(!data.gift&&data.re_using){
        data.gift=true;
        let brand_re=wx.getStorageSync('brand_re')
        data.act[0].content=brand_re[0].content;
        data.act[0].end_date=brand_re[0].end_date;
      }
      if (list.length >= 1) {
        console.log(list[0].status, stamp, list[0].timestamp)
        if ((list[0].status == 'success' && stamp <= list[0].timestamp) || (list[0].status == 'waiting' && stamp <= list[0].timestamp)) {
          this.setData({
            reservation: 'already'
          })
        }
      }
      if (data.reservation) {
        if (data.reservation[0] == 'has') {
          this.setData({
            reservation: 'already'
          })
        }
      }
      this.setData({
        data: data
      })
    }
    var that = this;
    let wares = app.globalData.wares;
    for (let i = 0; i < wares.length; i++) {
      wares[i].checked = false;
      if (i + 1 == wares.length) that.setData({
        checkbox: wares
      })
    }
  },
  callphone: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.data.phone,
    })
  },
  openLocation: function () {
    var that = this;
    wx.openLocation({
      latitude: that.data.data.lat,
      longitude: that.data.data.lon,
      name: that.data.data.address_name,
      address: that.data.data.address
    })
  },
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e)
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.showLoading({
        title: '授权中',
      })
      wx.cloud.callFunction({
        name: 'decode',
        data: {
          weRunData: wx.cloud.CloudID(e.detail.cloudID),
        }
      }).then(res => {
        wx.hideLoading()
        that.setData({
          phone: res.result,
        })
        let phone = res.result;
        if (!wx.getStorageSync('phone')) {
          wx.setStorageSync('phone', res.result)
          wx.cloud.database().collection('user').where({
            _openid: wx.getStorageSync('userInfo')._openid
          }).get().then(res => {
            console.log(res)
            if (!res.data[0].phone) {
              wx.cloud.callFunction({
                name: 'recordUpdate',
                data: {
                  collection: 'user',
                  where: {
                    _openid: wx.getStorageSync('userInfo')._openid
                  },
                  updateData: {
                    phone: phone
                  }
                }
              }).then(res => {
                console.log(res)
              })
            }
          })
        }
        let userInfo = wx.getStorageSync('userInfo')
        userInfo.phone = phone;
        wx.setStorageSync('userInfo', userInfo)
        wx.hideLoading()
        if (timer) clearTimeout(timer);
        timer = setTimeout(async res => {
          that.add(phone, userInfo);
        }, 500)

      }).catch(error => {
        console.log(error);
        wx.hideLoading()
        wx.showToast({
          title: '授权失败',
          icon: 'none'
        })
      })

    }
  },
  async submit() {
    var that = this;
    let userInfo =  wx.getStorageSync('userInfo');
    if(userInfo.type === "shopkeeper"){
      wx.showToast({
        title: '您是门店商家，不可预约',
        icon: 'none'
      })
      return;
     }

    if (that.data.nameList[0] == "请选择想要体验的商品，可多选") {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      })
      return;
    }
    
    if (that.data.startTime === '请选择到店时间') {
      wx.showToast({
        title: '请选择到店时间',
        icon: 'none'
      })
      return;
    }

    if(flag === true){
      wx.showToast({
        title: '时间已过，请重新选择',
        icon: 'none'
      })
      return;
    }
    
    wx.requestSubscribeMessage({
      tmplIds: ['-m92htbt5V0SlqRwZaMZAy9l3mv3CNseLM-yDKlRG5g', 'SVnl7juS4DJeu57ZvCHsFtWrp3y1bfTT7_rbv36mXY0', 'GN7JfS1q9N7eqdmvOxcFY6kjBBrUsnyRc6UGr58LAwg'],
      success(res) {
        if (JSON.stringify(res).indexOf('accept') !== -1) {
          console.log(that.data.nameList)
          if (timer) clearTimeout(timer);
          timer = setTimeout(async res => {
            //let phone = wx.getStorageSync('phone')
            let userInfo = wx.getStorageSync('userInfo')
            that.add(userInfo);
          }, 500)
        }
      }
    })
    
  },

  add(userInfo) {
    var that = this;
    let time = that.data.startTime;
    wx.showLoading({
      title: '预约中，请稍等',
    })
    let code = that.getRanNum();
    let numberCode = "";
    for (let e = 0; e < 10; e++) {
      numberCode += Math.floor(Math.random() * 10)
    }
    let id = '';
    let act_code = '';
    if (that.data.data.act.length > 0) {
      id = that.data.data.act[0]._id
      act_code = that.data.data.act[0].act_code
    }
    wx.cloud.callFunction({
      name: 'recordAdd',
      data: {
        collection: 'reservation',
        addData: {
          _openid: userInfo._openid,
          creation_date: util.formatTime(new Date()),
          //phone: phone,
          re_code: code + numberCode,
          shop_code: that.data.data.shop_code,
          shop_id: that.data.data._id,
          act_id: id,
          act_code: act_code,
          shopping: that.data.nameList,
          time: that.data.startTime,
          time_date:time,
          timestamp: Date.parse(time.replace(/-/g, '/')) / 1000,
          user: userInfo.nickName,
          status: 'waiting',
          creation_timestamp: Date.parse(util.formatTime(new Date()).replace(/-/g, '/')) / 1000,
        }
      }
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      wx.showToast({
        title: '预约成功',
        icon: 'success',
        duration: 2000
      })
      let cont = that.data.nameList.join(',').substring(0, 20)
      wx.setStorageSync('refreshData', that.data.data)
      that.sendMessage(that.data.data._openid, that.data.startTime, cont)
      wx.cloud.callFunction({
        name: 'recordAdd',
        data: {
          collection: 'message',
          addData: {
            creation_date: util.formatTime(new Date()),
            creation_timestamp: Date.parse(util.formatTime(new Date()).replace(/-/g, '/')) / 1000,
            _openid: app.globalData.openid,
            shop_code: that.data.data.shop_code,
            shop_id: that.data.data._id,
            re_code: code + numberCode,
            title: "门店预约已提交",
            content: '您在' + that.data.data.shop_name + '预约了' + that.data.startTime + '到店体验' + cont,
            type: 'myre',
            read: 'unread'
          }
        }
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 0,
        })
      }, 1500)
    })
  },
  getRanNum() {
    var result = [];
    for (var i = 0; i < 2; i++) {
      var ranNum = Math.ceil(Math.random() * 25);
      //大写字母'A'的ASCII是65,A~Z的ASCII码就是65 + 0~25;然后调用String.fromCharCode()传入ASCII值返回相应的字符并push进数组里
      result.push(String.fromCharCode(65 + ranNum));
    }
    return result.join('');
  },
  sendMessage: function (openid, time, content) {
    wx.cloud.callFunction({
      name: 'sendMessage',
      data: {
        openid: openid,
        page: 'pages/carAppointment/carAppointment',
        data: {
          "time3": {
            "value": time
          },
          "thing4": {
            "value": content
          },
        },
        templateId: 'SKiAQj0y7dfeW194AbS_uHnRfoqxuE_kz8Y-9uKeJwM'
      }
    }).then(res => {})
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
  // onShareAppMessage: function () {

  // }
})