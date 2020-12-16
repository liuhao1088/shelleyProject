// pages/addStoreInformation/addStoreInformation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeUrl: 'https://ae04.alicdn.com/kf/H320184699f6b4b16a88969d4fa0a9a73G.jpg', //二维码
    multiArray: [
      ['00：00', '01：00'],
      ['00：00', '01：00']
    ],
    objectMultiArray: [
      [{
          id: 0,
          name: '00：00'
        },
        {
          id: 1,
          name: '01：00'
        }
      ],
      [{
          id: 0,
          name: '00：00'
        },
        {
          id: 1,
          name: '01：00'
        }
      ]
    ],
    multiIndex: [0, 0],
    imgList:'',
    shop_name: '',
    address: '',
    person: '',
    phone: '',
    address_name: '',
    detail: '',
    shop_img:[],z:-1,
  },
  //保存图片，扫码
  previewImg: function (e) {
    console.log(e);
    wx.previewImage({
      urls: this.data.codeUrl.split(',') //所有要预览的图片的地址集合 数组形式,使用split把字符串转数组
    })
  },
  callmobile: function () {
    wx.makePhoneCall({
      phoneNumber: '18665877758',
    })
  },
  callphone: function () {
    wx.makePhoneCall({
      phoneNumber: '4009988078',
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            shop_img: res.tempFilePaths
          })
        }
      }
    });
  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  inputShopname: function (e) {
    this.setData({
      shop_name: e.detail.value
    })
  },
  inputPerson: function (e) {
    this.setData({
      person: e.detail.value
    })
  },
  inputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  chooseLocation: function (e) {
    var that = this;
    that.setData({
      z: 199
    })
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        let addressJson = res;
        wx.setStorageSync('addressJson', addressJson)
        that.showModal();
        that.setData({
          address: res.address,
          address_name: res.name,
        })
      },
    })
  },
  inputAddressname: function (e) {
    this.setData({
      address_name: e.detail.value
    })
  },
  inputAddress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  inputDetail: function (e) {
    console.log(e)
    this.setData({
      detail: e.detail.value
    })
  },
  //提交
  async submit() {
    var that = this;
    if (that.data.shop_name !== "" && that.data.address !== "" && that.data.phone !== "") {
      wx.showLoading({
        title: '提交中，请稍等',
      })
      that.add();

    } else {
      wx.showModal({
        showCancel: false,
        title: '请填写完整内容'
      })
    }

  },

  add: function () {
    var that = this;
    const creation_date = util.formatTime(new Date())
    let addressJson = wx.getStorageSync('addressJson')
    wx.cloud.callFunction({
      name: "collectionAdd", //
      data: {
        collection: 'shop',
        addData: {
          creation_date: creation_date,
          shop_name: that.data.shop_name,
          address: that.data.address,
          lat: addressJson.latitude,
          lon: addressJson.longitude,
          address_name: that.data.address_name,
          detail: that.data.detail,
          person: that.data.person,
          phone: that.data.phone,
          creation_timestamp: Date.parse(creation_date.replace(/-/g, '/')) / 1000,
        },

      }
    }).then(res => {
      console.log('更新数据库成功', res)
      wx.hideLoading({
        success: (res) => {},
      })
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000
      })
      setTimeout(function () {
        that.setData({
          navId: 0,
          currentId: 0,
          address: "",
          phone: '',
          person: '',
          shop_name: '',
          address_name: '',
          detail: ''
        })
      }, 2000)
    }).catch(error => {
      wx.hideLoading({
        success: (res) => {},
      })
      wx.showModal({
        showCancel: false,
        title: '添加失败，请重试'
      })
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
  onShareAppMessage: function () {

  }
})