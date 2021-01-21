// pages/groupActivities/groupActivities.js
var app = getApp();
var util = require('../../utils/util.js')
let timer;
var scode;
var id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: '2021-01-20 12:30', //活动开始时间
    endTime: '2021-01-20 12:30', //活动截止时间
    productList: [{
      "name": '请选择想要体验的商品',
      "price": '',
      "people": '',
      "time": '',
      "showView": false
    }], //活动商品
    checkbox: [], //商品选择
    index: 0,
    title: '',
    ind: 0,
    transmit: '',
  },
  //获取活动开始时间
  changeStartTime(e) {
    console.log(e.detail.startTime)
    this.setData({
      startTime: e.detail.value
    })
  },

  // 获取活动截止时间
  changeEndTime(e) {
    console.log(e.detail.endTime)
    this.setData({
      endTime: e.detail.value
    })
  },

  //添加活动商品
  onAdd(e) {
    let productList = this.data.productList;
    let index = e.currentTarget.dataset.idx;
    if (productList[index].price == '' || productList[index].people == '' || productList[index].time == '' || productList[index].name == '请选择想要体验的商品') {
      wx.showToast({
        title: '请填写完内容，再添加活动商品',
        icon: 'none',
        duration: 2000
      })
    } else {
      // console.log(index)
      let newData = {
        "name": '请选择想要体验的商品',
        "price": '',
        "people": '',
        "time": '',
        "showView": false
      };
      if (productList.length >= 6) {
        wx.showToast({
          title: '最多添加6个商品',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      productList.push(newData);
      // console.log(this.data.productList[index].showView)
      this.data.productList[index].showView = !this.data.productList[index].showView;
      // console.log(this.data.productList[index].showView)
      this.setData({
        productList,
      })
    }

  },

  delList(e) {
    var nowidx = e.currentTarget.dataset.idx; //当前索引
    var newList = this.data.productList[nowidx];
    console.log(this.data.productList[nowidx])
    if (nowidx > 0) {
      if (newList.showView === false) {
        this.data.productList[nowidx - 1].showView = false;
      }
    }

    var productList = this.data.productList;
    productList.splice(nowidx, 1);
    this.setData({
      productList
    })
  },

  //获取input的值
  bindChanguser(e) {
    console.log(e.detail.value)
    let productList = this.data.productList;
    var index = e.currentTarget.dataset.idx; //获取当前索引
    var type = e.currentTarget.id; //状态
    let value = e.detail.value;
    console.log(type);
    productList[index][type] = value
    if (type == 'time' && value >= 1440) {
      console.log(type)
      wx.showToast({
        title: '时间限制范围为1~1440',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    switch(productList[index].name){
      case '请选择想要体验的商品':
        if(type=='price'){
          productList[index].price=''
          this.setData({
            productList:productList
          })
          wx.showToast({
            title: '请先选择商品',
            icon:'none',
            duration:2000
          })
        }
        break;
      default:
        if(type=='price'){
          if(parseInt(productList[index].price)>=parseInt(productList[index].original_price)){
            productList[index].price=''
            this.setData({
              productList:productList
            })
            wx.showToast({
              title: '拼团价不能高于原价',
              icon:'none',
              duration:2000
            })
          }
        }
    }
  },
   
  blur:function(e){
    let productList = this.data.productList;
    var index = e.currentTarget.dataset.idx;
    var type = e.currentTarget.id;
    if(type=='people'){
      if(productList[index].people<=1){
        productList[index].people=''
            this.setData({
              productList:productList
            })
            wx.showToast({
              title: '拼团人数不能少于2人',
              icon:'none',
              duration:2000
            })
      }
    }
  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target,
      index: e.currentTarget.dataset.idx
    })
  },
  hideModal(e) {
    let index = this.data.index;
    let productList = this.data.productList;
    let items = this.data.checkbox;
    if(!items[this.data.ind].not_joining){
      productList[index] = Object.assign(productList[index], items[this.data.ind]);
    }
    this.setData({
      modalName: null,
      productList: productList
    })
    //console.log(productList)
  },
  chooseCheckbox(e) {
    let items = this.data.checkbox;
    let ind = e.currentTarget.dataset.index;
    for (let i in items) items[i].checked = false
    if(items[ind].not_joining){
      wx.showToast({
        title: '该商品暂不参与活动',
        icon:'none',
        duration:1000
      })
    }else{
      items[ind].checked = true;
    }
    this.setData({
      checkbox: items,
      ind: ind
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      startTime: '请选择开始时间',
      endTime: '请选择截止时间'
    })

    let flag = app.globalData.flag;
    console.log(flag)
    this.setData({
      flag
    })
    
    var that = this;
    let wares = app.globalData.wares;
    for (let i = 0; i < wares.length; i++) {
      wares[i].checked = false;
      if (i + 1 == wares.length) that.setData({
        checkbox: wares
      })
    }
    let userInfo=wx.getStorageSync('userInfo')
    scode=userInfo.shop[userInfo.shop.length - 1].shop_code;
    id=userInfo.shop[userInfo.shop.length - 1]._id;
    if(options.parse){
      scode='all'
      id='all'
    }
    if (options.data) {
      let data = JSON.parse(options.data)
      console.log(data)
      wx.setNavigationBarTitle({
        title: '编辑拼团活动'
      })
      let i = 0;
      do {
        data.shopping[i].showView = true;
        if (i + 1 == data.shopping.length) {
          data.shopping[i].showView = false;
        }
        i++;
      } while (i < data.shopping.length)
      that.setData({
        transmit: data,
        title: data.title,
        startTime: data.start_date,
        endTime: data.end_date,
        productList: data.shopping
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
  inputTitle: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  async submit_form() {
    var _this = this;
    var list = _this.data.productList;
    let time = util.formatTime(new Date());//当前时间
    let startTime = _this.data.startTime;//开始时间
    let endTime = _this.data.endTime;//结束时间
    var oDate1 = new Date(time);
    var oDate2 = new Date(startTime);
    var oDate3 = new Date(endTime);
    console.log("当前时间："+oDate1.getTime(),"到店时间："+oDate2.getTime(),"结束时间："+oDate3.getTime());
    if (oDate1.getTime() >= oDate2.getTime()) {
      wx.showToast({
        title: '时间已过，请重新选择开始时间',
        icon: 'none'
      })
      return ;
    } 
    if (oDate1.getTime() >= oDate3.getTime()) {
      wx.showToast({
        title: '时间已过，请重新选择截止时间',
        icon: 'none'
      })
      return ;
    } 

    if (oDate2.getTime() >= oDate3.getTime()) {
      wx.showToast({
        title: '截止时间不能小于开始时间',
        icon: 'none'
      })
      return ;
    } 
    
    if (_this.data.title == "" || list[list.length - 1].price == '' || list[list.length - 1].time == '' || list[list.length - 1].people == '' || list[list.length - 1].name == '请选择想要体验的商品') {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none'
      })
    } else {
      if (_this.data.transmit == '') {
        wx.showLoading({
          title: '提交中',
        })
        if (timer) clearTimeout(timer);
        timer = setTimeout(async res => {
          wx.setStorageSync('refresh', 'has')
          await _this.add();
        }, 500)
      } else {
        if (timer) clearTimeout(timer);
        timer = setTimeout(async res => {
          wx.setStorageSync('refresh', 'has')
          await _this.update();
        }, 500)
      }

    }
  },
  add: function () {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo')
    var creation_date = util.formatTime(new Date())
    wx.showLoading({
      title: '提交中',
    })
    let code = that.getRanNum();
    let numberCode = "";
    for (let e = 0; e < 10; e++) {
      numberCode += Math.floor(Math.random() * 10)
    }
    var list = that.data.productList;
    for (let i in list) {
      delete list[i].showView;
      delete list[i].checked
    }
    wx.cloud.callFunction({
      name: 'recordAdd',
      data: {
        collection: 'activity',
        addData: {
          creation_date: creation_date,
          creation_timestamp: Date.parse(creation_date.replace(/-/g, '/')) / 1000,
          title: that.data.title,
          start_date: that.data.startTime,
          start_timestamp: Date.parse(that.data.startTime.replace(/-/g, '/')) / 1000,
          end_date: that.data.endTime,
          end_timestamp: Date.parse(that.data.endTime.replace(/-/g, '/')) / 1000,
          shopping: list,
          act_code: code + numberCode,
          shop_code: scode,
          shop_id: id,
          lat: userInfo.shop[userInfo.shop.length - 1].lat,
          lon: userInfo.shop[userInfo.shop.length - 1].lon,
          _openid: userInfo._openid,
          type: 'team'
        }
      }
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      wx.showToast({
        title: '发布活动成功',
        icon: 'success',
        duration: 2000
      })
      setTimeout(res => {
        wx.navigateBack({
          delta: 2,
        })
      }, 2000)
    }).catch(error => {
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      wx.showModal({
        title: '服务器繁忙，请稍后重试',
      })
    })
  },
  update: function () {
    var that = this;
    wx.showLoading({
      title: '保存中',
    })
    var list = that.data.productList;
    list.forEach((item, index, arr) => {
      delete item.showView;
      delete item.checked;
    })
    wx.cloud.callFunction({
      name: 'recordUpdate',
      data: {
        collection: 'activity',
        where: {
          _id: that.data.transmit._id
        },
        updateData: {
          title: that.data.title,
          start_date: that.data.startTime,
          start_timestamp: Date.parse(that.data.startTime.replace(/-/g, '/')) / 1000,
          end_date: that.data.endTime,
          end_timestamp: Date.parse(that.data.endTime.replace(/-/g, '/')) / 1000,
          shopping: list,
        }
      }
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      wx.showToast({
        title: '编辑活动成功',
        icon: 'success',
        duration: 2000
      })
      setTimeout(res => {
        wx.navigateBack({
          delta: 1
        })
      }, 2000)
    }).catch(error => {
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      wx.showModal({
        title: '服务器繁忙，请稍后重试',
      })
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