// pages/addStoreInformation/addStoreInformation.js
var hourArr;
var util=require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeUrl: 'https://ae04.alicdn.com/kf/H320184699f6b4b16a88969d4fa0a9a73G.jpg', //二维码
    multiArray: [],
    multiIndex: [0, 23],
    shop_name: '',
    address: '',
    person: '',
    phone: '',
    address_name: '',
    detail: '',
    shop_img:[],z:-1,firstLoading:true
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
        this.setData({
          shop_img: res.tempFilePaths
        })
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
    hourArr=['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'];
    let array=[];
    for(let i=0;i<2;i++){array.push(hourArr)}
    this.setData({multiArray:array})
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
  MultiChange:function(e){
    console.log(e)
    this.setData({multiIndex:e.detail.value,firstLoading:false})
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
        that.setData({
          address: res.address,
          address_name: res.name,
          modalName:'addressConfirm'
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
      let arr=[];
      if (that.data.shop_img !== []) await that.uploadimg(0, that.data.shop_img, 'shop',arr )
      that.add(arr);

    } else {
      wx.showModal({
        showCancel: false,
        title: '请填写完整内容'
      })
    }

  },

  add: function (imgArr) {
    var that = this;
    const creation_date = util.formatTime(new Date())
    let addressJson = wx.getStorageSync('addressJson');
    wx.cloud.callFunction({
      name: "recordAdd", //
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
          start_hour:hourArr[that.data.multiIndex[0]],
          end_hour:hourArr[that.data.multiIndex[1]],
          shop_img:imgArr,
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
          address: "",
          phone: '',
          person: '',
          shop_name: '',
          address_name: '',
          detail: '',
          shop_img:[]
        })
      }, 2000)
    }).catch(error => {
      wx.hideLoading({
        success: (res) => {},
      })
      wx.showModal({
        showCancel: false,
        title: '提交失败，请稍后重试'
      })
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  //上传图片到云存储
  uploadimg: function (i, parse, content, arr) {
    if(parse.length == 0) return;
    return new Promise((resolve, reject) => {
      var that = this;
      let code = that.getRandomCode();
      let numberCode = "";
      for (let e = 0; e < 6; e++) {
        numberCode += Math.floor(Math.random() * 10)
      }
      let path=parse[i] 
      let indx=path.lastIndexOf('.') 
      let postfix=path.substring(indx)
      wx.cloud.uploadFile({
        cloudPath: content + '/' + content + '-' + code + "-" + numberCode + postfix,
        filePath: parse[i],
        success(res) {
          //上传成功后会返回永久地址
          console.log(res.fileID)
          arr.push(res.fileID)
          resolve(arr);
          //that.uploadimg(i+1,parse,content,arr)
        }
      })

    })
  },
   //生成随机6位数
   getRandomCode: function () {
    let code = "";
    const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e',
      'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
      'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
      'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];

    for (let i = 0; i < 6; i++) {
      let id = Math.round(Math.random() * 61);
      code += array[id];
    }
    return code;
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