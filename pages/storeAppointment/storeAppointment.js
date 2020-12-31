// pages/storeAppointment/storeAppointment.js
var util = require('../../utils/util.js');
var date = new Date();
var timer;
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
    startTime: "选择日期",
    multiArray: [
      [],
      [],
    ],
    multiIndex: [0, 0],
  },
  changeStartTime(e) {
    this.setData({
      startTime: e.detail.value
    })
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
  //预约时间选择器
  pickerTap: function () {
    // var yesr = [];
    var monthDay = [];
    var hour = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', ];
    // 月-日
    for (var i = 0; i <= 30; i++) {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + i);
      var md = (date1.getMonth() + 1) + "月" + date1.getDate() + "日";
      monthDay.push(md);
    }
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    // var newYesr = util.year(new Date());
    // yesr.push(newYesr);
    // console.log(yesr)
    // data.multiArray[0] = yesr;
    data.multiArray[0] = monthDay;
    data.multiArray[1] = hour;
    this.setData(data);
  },
  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    // 把选择的对应值赋值给 multiIndex
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },
  bindStartMultiPickerChange: function (e) {
    var that = this;
    var monthDay = that.data.multiArray[0][e.detail.value[0]];
    var timedate = that.data.multiArray[1][e.detail.value[1]];
    console.log(monthDay)
    // if(monthDay === '1月1日'){
    //   var yesr = [];
    //   var newYesr = util.year(new Date());
    //   yesr.push(newYesr +1);
    //   that.data.multiArray[0] = yesr;
    // }

    if (monthDay === "明天") {
      var month = date.getMonth() + 1;
      var day = date.getDate() + 1;
      console.log(month + "月" + day + "日")
      monthDay = month + "月" + day + "日";
    } else if (monthDay === "后天") {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + 2);
      monthDay = (date1.getMonth() + 1) + "月" + date1.getDate() + "日";
    }
    let startTime = monthDay + ' ' + timedate
    that.setData({
      startTime
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.data) {
      let data = JSON.parse(options.data)
      console.log(data)
      let userInfo = wx.getStorageSync('userInfo')
      wx.cloud.database().collection('reservation').where({
        shop_code: data.shop_code,
        _openid: userInfo._openid
      }).orderBy('creation_date', 'desc').get().then(res => {
        let list = res.data
        let stamp = Date.parse(util.formatTime(new Date()).replace(/-/g, '/')) / 1000;
        if (list.length >= 1) {
          if ((list[0].status == 'success' && stamp <= list[0].timestamp) || (list[0].status == 'waiting' && stamp <= list[0].timestamp)) {
            this.setData({
              reservation: 'already'
            })
          }
        }
      })
      console.log(data)
      this.setData({
        data: data
      })
    }
    var that = this;
    wx.cloud.callFunction({
      name: 'showwares'
    }).then(res => {
      let data = res.result;
      for (let i = 0; i < data.length; i++) {
        data[i].checked = false;
        if (i + 1 == data.length) that.setData({
          checkbox: data
        })
      }
    })
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => console.log(res))
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
    if (that.data.nameList[0] == "请选择想要体验的商品，可多选") {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      })
      return;
    }

    if (that.data.startTime === '选择日期') {
      wx.showToast({
        title: '请选择到店时间',
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
    let yDigit = util.year(new Date());
    let mDigit = time.substring(0, time.indexOf('月'));
    if ((new Date()).getMonth() + 1 !== mDigit && (new Date()).getMonth() + 1 == 12) {
      yDigit = yDigit + 1;
    }
    if (mDigit < 10) mDigit = '0' + mDigit;
    let dDigit = time.substring(time.indexOf('月') + 1, time.indexOf('日'))
    if (dDigit < 10) dDigit = '0' + dDigit;
    let time_date = yDigit + '-' + mDigit + '-' + dDigit + time.substring(time.indexOf('日') + 1);
    wx.showLoading({
      title: '预约中，请稍等',
    })
    let code = that.getRanNum();
    let numberCode = "";
    for (let e = 0; e < 10; e++) {
      numberCode += Math.floor(Math.random() * 10)
    }
    let id='';
    let act_code='';
    if(that.data.data.act.length>0){
      id=that.data.data.act[0]._id
      act_code=that.data.data.act[0].act_code
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
          act_id: id,
          act_code: act_code,
          shopping: that.data.nameList,
          time: that.data.startTime,
          time_date: time_date,
          timestamp: Date.parse(time_date.replace(/-/g, '/')) / 1000,
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