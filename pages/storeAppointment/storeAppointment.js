// pages/storeAppointment/storeAppointment.js
var util = require('../../utils/util.js')
var timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: '2021-01-10 12:00',
    checkbox: [],
    nameList: ['请选择想要体验的商品，可多选'],
    data: '',
    firstLoading: true,
    isShow: false,
    reservation: '',
    ind: 0
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
        if (list.length >= 1) {
          this.setData({
            reservation: 'already'
          })
        }
      })
      this.setData({
        data: data
      })
    }
    console.log(util.formatTime(new Date()));
    this.setData({
      
      startTime: util.formatTime(new Date())
    })
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

    if (that.data.startTime === util.formatTime(new Date())) {
      wx.showToast({
        title: '请选择到店时间',
        icon: 'none'
      })
      return;
    }

    wx.requestSubscribeMessage({
      tmplIds: ['GN7JfS1q9N7eqdmvOxcFY6kjBBrUsnyRc6UGr58LAwg', 'pvZ2jnDjUwfpT2bpby2SxP5P1tcl3LXcn9RfOc8ibuI'],
      success(res) {
        console.log(res)
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
    wx.showLoading({
      title: '预约中，请稍等',
    })
    let code = that.getRanNum();
    let numberCode = "";
    for (let e = 0; e < 10; e++) {
      numberCode += Math.floor(Math.random() * 10)
    }
    wx.cloud.callFunction({
      name: 'recordAdd',
      data: {
        collection: 'reservation',
        addData: {
          _openid: userInfo._openid,
          creation_date: util.formatTime(new Date()),
          //phone: phone,
          re_code:code+numberCode,
          shop_code: that.data.data.shop_code,
          act_id: that.data.data.act[0]._id,
          act_code: that.data.data.act[0].act_code,
          shopping: that.data.nameList,
          time: that.data.startTime,
          timestamp: Date.parse(that.data.startTime.replace(/-/g, '/')) / 1000,
          user: userInfo.nickName,
          status:'waiting',
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
      wx.setStorageSync('refreshData', that.data.data)
      setTimeout(() => {
        wx.navigateBack({
          delta: 0,
        })
      }, 1500)
    })
  },
  getRanNum(){
    var result = [];
    for(var i=0;i<2;i++){
      var ranNum = Math.ceil(Math.random() * 25);
      //大写字母'A'的ASCII是65,A~Z的ASCII码就是65 + 0~25;然后调用String.fromCharCode()传入ASCII值返回相应的字符并push进数组里
      result.push(String.fromCharCode(65+ranNum));
    }
    return  result.join('');
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