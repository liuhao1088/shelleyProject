// pages/groupActivities/groupActivities.js
var clickindex = new Array();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: '2020-12-17 11:32', //活动开始时间
    endTime: '2020-12-17 11:32', //活动截止时间
    productList: [{
      "name": '请选择想要体验的商品',
      "price": '',
      "people": '',
      "time": '',
      "showView": false
    }], //活动商品
    checkbox: [{
      value: 0,
      name: '如影系列-R1',
      checked: false,
    }, {
      value: 1,
      name: '如影系列-R2',
      checked: false,
    }, {
      value: 2,
      name: '斑马系列-B2',
      checked: false,
    }, {
      value: 3,
      name: '斑马系列-B3',
      checked: false,
    }, {
      value: 4,
      name: '双色系列-S3',
      checked: false,
    }, {
      value: 5,
      name: '猎豹系列-T3',
      checked: false,
    }], //商品选择
    index:0
  },
  //获取活动开始时间
  changeStartTime(e) {
    console.log(e.detail.startTime)
    this.setData({
      startTime: e.detail.startTime
    })
  },

  // 获取活动截止时间
  changeEndTime(e) {
    console.log(e.detail.endTime)
    this.setData({
      endTime: e.detail.endTime
    })
  },

  //获取分钟
  // timeChange(e) {
  //   let productList =  this.data.productList
  //   var index = e.currentTarget.dataset.idx; //获取当前索引
  //   // console.log(index)
  //   productList[index].time = e.detail.value;
  //   this.setData({
  //     productList,
  //   })
  // },

  //添加活动商品
  onAdd(e) {
    let productList = this.data.productList;
    let index = e.currentTarget.dataset.idx;
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
  },

  //获取input的值
  bindChanguser(e) {
    let productList = this.data.productList;
    var index = e.currentTarget.dataset.idx; //获取当前索引
    var type = e.currentTarget.id; //状态
    // console.log(index)
    productList[index][type] = e.detail.value
    // console.log(productList[index][type])
  },

  // //失去焦点赋值给input
  // blurChanguser(e){
  //   let productList = this.data.productList;
  //   var index = e.currentTarget.dataset.idx; //获取当前索引
  //   var type = e.currentTarget.id; //状态
  //   console.log(index);
  //   productList[index][type] = e.detail.value;
  //   this.setData({
  //     [productList[index][type]]:e.detail.value,
  //   })
  // },
  showModal(e) {
    // console.log(e.currentTarget.dataset.idx)
    this.setData({
      modalName: e.currentTarget.dataset.target,
      index:e.currentTarget.dataset.idx
    })
  },
  hideModal(e) {
    let index = this.data.index;
    let productList = this.data.productList;
    let nameList = [];
    let items = this.data.checkbox;
    for (let i = 0; i < items.length; i++) {
      if (items[i].checked == true) {
        nameList.push(items[i].name);
      }
    }
    if (nameList == '') {
      productList[index].name = ['请选择想要体验的商品']
    }
    productList[index].name = nameList
    this.setData({
      modalName: null,
      productList:productList
    })
    // console.log(productList)
  },
  chooseCheckbox(e) {
    let items = this.data.checkbox;
    let values = e.currentTarget.dataset.value;
    // console.log(values)
    for (let i = 0; i < items.length; ++i) {
      if (items[i].value == values) {
        console.log(items[i].value);
        items[i].checked = true;
      }else{
        items[i].checked = false;
      }
    }
    this.setData({
      checkbox: items,
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let date =  uilt.formatTime(new Date());
    // this.setData({
    //  startTime:date,
    //  endTime:date
    // })
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
  onShareAppMessage: function () {

  }
})