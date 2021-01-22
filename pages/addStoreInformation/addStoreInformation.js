// pages/addStoreInformation/addStoreInformation.js
var hourArr;
var util = require('../../utils/util.js');
let timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeUrl: ['https://dingyue.ws.126.net/2021/0109/39e9d227p00qmnnfv000ac0002x002xm.png'], //二维码
    multiArray: [],
    multiIndex: [0, 23],
    shop_name: '',
    address: '',
    person: '',
    phone: '',
    address_name: '',
    detail: '',
    shop_img: [],
    z: -1,
    firstLoading: true,
    whetherEmpower: 'yes',
    fo: false,
    address_label: '',
    transmit: ''
  },
  //保存图片，扫码
  previewImg: function (e) {
    wx.previewImage({
        urls: this.data.codeUrl,
        current: e.currentTarget.dataset.url
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
    var that = this;
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

  ViewImage(e) {
    wx.previewImage({
      urls: this.data.shop_img,
      current: e.currentTarget.dataset.url
    });
  },

  DelImg(e) {
    let shop_img = this.data.shop_img;
    wx.showModal({
      content: '确定要删除图片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          shop_img.splice(0, 1);
          this.setData({
            shop_img
          })
        }
      }
    })
  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target,
      z: 200
    })
  },
  hideModal(e) {
    let string = this.data.address + this.data.detail;
    let label = '...' + string.substring(string.length - 7, string.length)
    this.setData({
      modalName: null,
      z: -1,
      address_label: label
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    hourArr = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    let array = [];
    for (let i = 0; i < 2; i++) {
      array.push(hourArr)
    }
    this.setData({
      multiArray: array
    })
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => console.log(res))
    if (options.data) {
      var that = this;
      let data = JSON.parse(options.data)
      wx.setNavigationBarTitle({
        title: '修改门店信息'
      })
      let string = data.address + this.data.detail;
      let label = '...' + string.substring(string.length - 7, string.length)
      let start_ind = hourArr.findIndex(function (item) {
        return item == data.start_hour;
      })
      let end_ind = hourArr.findIndex(function (item) {
        return item == data.end_hour;
      })
      console.log(start_ind, end_ind)
      that.setData({
        transmit: data,
        shop_name: data.shop_name,
        address_label: label,
        person: data.person,
        phone: data.phone,
        shop_img: data.shop_img,
        address: data.address,
        address_name: data.address_name,
        detail: data.detail,
        multiIndex: [start_ind, end_ind],
        firstLoading: false
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
  onShow: function () {

  },
  MultiChange: function (e) {
    console.log(e)
    this.setData({
      multiIndex: e.detail.value,
      firstLoading: false
    })
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
    console.log("11111");
    var that = this;
    that.setData({
      modalName: 'addressConfirm',
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
          modalName: 'addressConfirm',
          z: 200
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
    if (!wx.getStorageSync('userInfo')) {
      this.selectComponent("#authorize").showModal();
    } else {
      let userInfo = wx.getStorageSync('userInfo');
      console.log(userInfo.shop.length);
      if (!that.data.shop_name) {
        wx.showToast({
          title: '请填写门店名称',
          icon: 'none',
          duration: 3000
        })
        return;
      }

      if (!that.data.address) {
        wx.showToast({
          title: '请填写门店地址',
          icon: 'none',
          duration: 3000
        })
        return;
      }

      if (!that.data.person) {
        wx.showToast({
          title: '请填写联系人姓名',
          icon: 'none',
          duration: 3000
        })
        return;
      }

      if (!that.data.phone) {
        wx.showToast({
          title: '请填写联系电话',
          icon: 'none',
          duration: 3000
        })
        return;
      }

      let phoenReg = /^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/;
      if (!(phoenReg.test(that.data.phone))) {
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none',
          duration: 2000
        })
        return;
      }

      if (that.data.firstLoading == true) {
        wx.showToast({
          title: '请选择营业时间',
          icon: 'none',
          duration: 3000
        })
        return;
      }

      if (that.data.shop_img.length == 0) {
        wx.showToast({
          title: '请上传门店正面照',
          icon: 'none',
          duration: 3000
        })
        return;
      }
      if (that.data.transmit == '') {
        //提交
        if (userInfo.shop.length > 0) {
          if (userInfo.shop[userInfo.shop.length - 1].prove == 'waiting') {
            wx.showToast({
              title: '您的门店信息已提交，等待认证中，请勿重复提交',
              icon: 'none',
              duration: 3000
            })
          } else if (userInfo.shop[userInfo.shop.length - 1].prove == 'success') {
            wx.showToast({
              title: '您的门店已经通过认证，无需再提交',
              icon: 'none',
              duration: 3000
            })
          } else {
            if (that.data.shop_name !== "" && that.data.address !== "" && that.data.phone !== "" && that.data.shop_img !== []) {
              wx.requestSubscribeMessage({
                tmplIds: ['pvZ2jnDjUwfpT2bpby2SxP5P1tcl3LXcn9RfOc8ibuI', 'SKiAQj0y7dfeW194AbS_uHnRfoqxuE_kz8Y-9uKeJwM', 'Ggdc3CQ1c6V0ss6ZvsMnExScZjPHZ0-8_OFdCJRTubA'],
                success(res) {
                  console.log(res)
                  if (JSON.stringify(res).indexOf('accept') !== -1) {
                    wx.showLoading({
                      title: '提交中，请稍等',
                    })
                    if (timer) clearTimeout(timer);
                    timer = setTimeout(async res => {
                      let arr = [];
                      if (that.data.shop_img !== []) await util.uploadimg(0, that.data.shop_img, 'shop', arr)
                      that.add(arr);
                    }, 500)
                  }
                }
              })
            } else {
              wx.showToast({
                title: '请填写完整内容',
                icon: 'none',
                duration: 3000
              })
            }
          }
        } else {
          if (that.data.shop_name !== "" && that.data.address !== "" && that.data.phone !== "" && that.data.shop_img !== []) {
            wx.requestSubscribeMessage({
              tmplIds: ['pvZ2jnDjUwfpT2bpby2SxP5P1tcl3LXcn9RfOc8ibuI', 'SKiAQj0y7dfeW194AbS_uHnRfoqxuE_kz8Y-9uKeJwM', 'Ggdc3CQ1c6V0ss6ZvsMnExScZjPHZ0-8_OFdCJRTubA'],
              success(res) {
                console.log(res)
                if (JSON.stringify(res).indexOf('accept') !== -1) {
                  wx.showLoading({
                    title: '提交中，请稍等',
                  })
                  if (timer) clearTimeout(timer);
                  timer = setTimeout(async res => {
                    let arr = [];
                    if (that.data.shop_img !== []) await util.uploadimg(0, that.data.shop_img, 'shop', arr)
                    that.add(arr);
                  }, 500)
                }
              }
            })
          } else {
            wx.showToast({
              title: '请填写完整内容',
              icon: 'none',
              duration: 3000
            })
          }
        }

      } else {
        //修改
        wx.requestSubscribeMessage({
          tmplIds: ['pvZ2jnDjUwfpT2bpby2SxP5P1tcl3LXcn9RfOc8ibuI', 'SKiAQj0y7dfeW194AbS_uHnRfoqxuE_kz8Y-9uKeJwM', 'Ggdc3CQ1c6V0ss6ZvsMnExScZjPHZ0-8_OFdCJRTubA'],
          success(res) {
            console.log(res)
            if (JSON.stringify(res).indexOf('accept') !== -1) {
              wx.showLoading({
                title: '提交中，请稍等',
              })
              if (timer) clearTimeout(timer);
              timer = setTimeout(async res => {
                if (that.data.transmit.shop_img == that.data.shop_img) {
                  that.update(that.data.shop_img,false);
                } else {
                  let arr = [];
                  if(that.data.transmit.modify_shop_img){
                    wx.cloud.deleteFile({
                      fileList: userInfo.shop[userInfo.shop.length - 1].modify_shop_img,
                      success: res => {
                        // handle success
                        console.log(res.fileList)
                      },
                      fail: err => {
                        // handle error
                      },
                      complete: res => {
                        // ...
                      }
                    })

                  }
                  
                  if (that.data.shop_img !== []) await util.uploadimg(0, that.data.shop_img, 'shop', arr)
                  that.update(arr,true);
                }
      
              }, 500)
            
            }
          }
        })
        
      }


    }
  },

  add: function (imgArr) {
    var that = this;
    const creation_date = util.formatTime(new Date())
    let addressJson = wx.getStorageSync('addressJson');
    let userInfo = wx.getStorageSync('userInfo');
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
          start_hour: hourArr[that.data.multiIndex[0]],
          end_hour: hourArr[that.data.multiIndex[1]],
          shop_img: imgArr,
          _openid: userInfo._openid,
          user: userInfo.nickName,
          prove: 'waiting',
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
      userInfo.shop = [{
        prove: 'waiting'
      }]
      wx.setStorageSync('userInfo', userInfo)
      wx.cloud.callFunction({
        name:'recordAdd',
        data:{
          collection:'message',
          addData:{
            creation_date:creation_date,
            creation_timestamp:Date.parse(creation_date.replace(/-/g, '/')) / 1000,
            _openid:userInfo._openid,
            shop_code:'none',
            title:"提交成功",
            content:'您的门店认证申请已提交审核，预计3个工作日内会有工作人员与您联系，请保持手机畅通。',
            type:'check',
            res:'waiting',
            read:'unread'
          }
        }
      })
      wx.showModal({
        title: '提交成功',
        content: '您的门店认证申请已提交审核，预计3个工作日内会有工作人员与您联系，请保持手机畅通。',
        showCancel: false,
        confirmText: '确认',
        success:function(res){
          if(res.confirm){
            wx.navigateBack({
              delta: 0,
            })
          }
        }
      })
      setTimeout(function () {
        that.setData({
          address: "",
          phone: '',
          person: '',
          shop_name: '',
          address_name: '',
          detail: '',
          shop_img: [],
          address_label:''
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
  update: function (imgArr,ialter) {
    var that = this;
    let addressJson = wx.getStorageSync('addressJson');
    let transmit = that.data.transmit;
    const creation_date = util.formatTime(new Date())
    let userInfo = wx.getStorageSync('userInfo');
    let data={};
    switch(transmit.address == that.data.address){
      case false:
        console.log('1')
        data.modify_address=that.data.address
        data.modify_address_name = that.data.address_name
        data.modify_detail = that.data.detail
        data.modify_lon = addressJson.longitude
        data.modify_lat = addressJson.latitude
    }
    switch(transmit.shop_name==that.data.shop_name){
      case false:
        data.modify_shop_name=that.data.shop_name
    }
    switch(transmit.person==that.data.person){
      case false:
        data.modify_person=that.data.person
    }
    switch(transmit.phone==that.data.phone){
      case false:
        data.modify_phone=that.data.phone
    }
    switch(transmit.start_hour==hourArr[that.data.multiIndex[0]]){
      case false:
        data.modify_start_hour=hourArr[that.data.multiIndex[0]]
    }
    switch(transmit.end_hour==hourArr[that.data.multiIndex[1]]){
      case false: 
        data.modify_end_hour=hourArr[that.data.multiIndex[1]]
    }
    switch(transmit.shop_img==imgArr){
      case false:
        data.modify_shop_img=imgArr
    }
    if(Object.keys(data).length == 0){
      wx.showToast({
        title: '您没有修改内容，不能提交!',
        icon:'none'
      })
    }else{
      data.modify=true;
      wx.cloud.callFunction({
        name: "recordUpdate", //
        data: {
          collection: 'shop',
          where: {
            _id: that.data.transmit._id
          },
          updateData: data,
        }
      }).then(res => {
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 500
        })
        wx.cloud.callFunction({
          name:'recordAdd',
          data:{
            collection:'message',
            addData:{
              creation_date:creation_date,
              creation_timestamp:Date.parse(creation_date.replace(/-/g, '/')) / 1000,
              _openid:userInfo._openid,
              shop_code:'none',
              title:"提交成功",
              content:'您的门店修改申请已提交审核，预计3个工作日内会有工作人员与您联系，请保持手机畅通。',
              type:'check',
              res:'waiting',
              read:'unread'
            }
          }
        })
        wx.showModal({
          title: '提交成功',
          content: '您的门店修改申请已提交审核，预计3个工作日内会有工作人员与您联系，请保持手机畅通。',
          showCancel: false,
          confirmText: '确认',
          success:function(res){
            if(res.confirm){
              wx.navigateBack({
                delta: 0,
              })
            }
          }
        })
        let userInfo=wx.getStorageSync('userInfo')
        userInfo.shop[userInfo.shop.length - 1].modify_shop_img=imgArr
        //transmit.shop_name = that.data.shop_name;
        //transmit.person = that.data.person;
        //transmit.phone = that.data.phone;
        //transmit.start_hour = hourArr[that.data.multiIndex[0]];
        //transmit.end_hour = hourArr[that.data.multiIndex[1]];
        //transmit.shop_img=imgArr
        //userInfo.shop[userInfo.shop.length - 1] = transmit;
        wx.setStorageSync('userInfo', userInfo)
        
      }).catch(error => {
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showModal({
          showCancel: false,
          title: '提交失败，请稍后重试'
        })
      })
    }
    if (transmit.address !== that.data.address) {
      //transmit.address = that.data.address
      transmit.address_name = that.data.address_name
      transmit.detail = that.data.detail
      transmit.lon = addressJson.longitude
      transmit.lat = addressJson.latitude
    }
    switch(ialter){
      case true:
        data={
          modify_shop_name: that.data.shop_name,
          modify_address: transmit.address,
          modify_lat: transmit.lat,
          modify_lon: transmit.lon,
          modify_address_name: transmit.address_name,
          modify_detail: transmit.detail,
          modify_person: that.data.person,
          modify_phone: that.data.phone,
          modify_start_hour: hourArr[that.data.multiIndex[0]],
          modify_end_hour: hourArr[that.data.multiIndex[1]],
          modify:true,
          modify_img:imgArr
        }
        break;
      default:
        data={
          shop_name: that.data.shop_name,
          address: transmit.address,
          lat: transmit.lat,
          lon: transmit.lon,
          address_name: transmit.address_name,
          detail: transmit.detail,
          person: that.data.person,
          phone: that.data.phone,
          start_hour: hourArr[that.data.multiIndex[0]],
          end_hour: hourArr[that.data.multiIndex[1]],
          shop_img: imgArr,
        }
    }
    
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  phoneModal: function () {
    this.setData({
      modalName: 'phoneModal',
      z: 200
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
        that.hideModal();
        wx.showToast({
          title: '授权成功',
          icon: 'success'
        })
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
  changeInput: function () {
    var _this = this;
    this.hideModal()
    setTimeout(res => {
      _this.setData({
        whetherEmpower: 'no'
      })
    })
  },
  changeEmpower: function () {
    this.setData({
      whetherEmpower: 'yes'
    })
  },
  phoneConfirm: function (e) {
    this.setData({
      phone: e.detail.value
    })
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