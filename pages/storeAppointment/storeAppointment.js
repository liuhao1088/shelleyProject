// pages/storeAppointment/storeAppointment.js
var util = require('../../utils/util.js')
var timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: '2020-12-17 11:32',
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
      if (data.reservation.length !== 0) {
        this.setData({
          reservation: 'already'
        })
      }
      this.setData({
        data: data
      })
    }
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
  openLocation: function () {
    var that = this;
    wx.openLocation({
      latitude: that.data.data.shop[0].lat,
      longitude: that.data.data.shop[0].lon,
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
    wx.requestSubscribeMessage({
      tmplIds: ['GN7JfS1q9N7eqdmvOxcFY6kjBBrUsnyRc6UGr58LAwg','pvZ2jnDjUwfpT2bpby2SxP5P1tcl3LXcn9RfOc8ibuI'],
      success (res) {
        console.log(res)
        if(JSON.stringify(res).indexOf('accept')!==-1){
          console.log(that.data.nameList)
          if (that.data.nameList[0] == "请选择想要体验的商品，可多选") {
            wx.showToast({
              title: '请选择商品',
              icon: 'none'
            })
          } else {
            if (timer) clearTimeout(timer);
            timer = setTimeout(async res => {
              let phone = wx.getStorageSync('phone')
              let userInfo = wx.getStorageSync('userInfo')
              that.add(phone, userInfo);
            }, 500)      
          }
        }
      }
    })
    
  },
  add(phone, userInfo) {
    var that = this;
    wx.showLoading({
      title: '预约中，请稍等',
    })
    wx.cloud.callFunction({
      name: 'recordAdd',
      data: {
        collection: 'reservation',
        addData: {
          _openid: userInfo._openid,
          creation_date: util.formatTime(new Date()),
          phone: phone,
          shop_code: that.data.data.shop[0].shop_code,
          act_id: that.data.data._id,
          act_code: that.data.data.act_code,
          shopping: that.data.nameList,
          time: that.data.startTime,
          timestamp: Date.parse(that.data.startTime.replace(/-/g, '/')) / 1000,
          user: userInfo.nickName,
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
  req:function(){
    const thing1="您的门店认证已经通过";
    wx.cloud.callFunction({
      name:'sendMessage',
      data:{
        openid:'oQQ_f4s48shRNF-_wWLKnAgCEfew',
        page:'index',
        data:{
          "thing1": {
            "value": thing1
          },
          "thing3": {
            "value": "您在雪莱特上提交的门店信息已经认证通过"
          },
        },
        templateId:'pvZ2jnDjUwfpT2bpby2SxP5P1tcl3LXcn9RfOc8ibuI',
        state:'developer'
      }
    }).then(res=>{
      console.log(res)
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
    /*if (!wx.getStorageSync('phone')) {
      this.setData({
        isShow: true
      })
    }*/ 
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