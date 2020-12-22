// pages/groupActivities/groupActivities.js
var clickindex = new Array();
var util=require('../../utils/util.js')
let timer;
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
    index:0,
    title:''
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
    let value = e.detail.value;
    console.log(type);
    productList[index][type] = value
    if(type == 'time' && value >= 1440){
      console.log(type)
      wx.showToast({
        title: '时间限制范围为1~1440',
        icon: 'none',
        duration: 2000
      })
      return;
    }
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
  inputTitle:function(e){
    this.setData({title:e.detail.value})
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  async submit_form(){
    var _this=this;
    if(_this.data.title==""){
      wx.showToast({
        title: '内容不能为空',
        icon:'none'
      })
    }else{
      wx.showLoading({
        title: '提交中',
      })
      if (timer) clearTimeout(timer);
      timer= setTimeout(async res=>{
        await _this.add();
      },500)  
    }
  },
  add:function(){
    var that=this;
    var userInfo=wx.getStorageSync('userInfo')
    var creation_date=util.formatTime(new Date())
    wx.showLoading({
      title: '提交中',
    })
    let code = that.getRanNum();
    let numberCode = "";
    for (let e = 0; e < 10; e++) {
      numberCode += Math.floor(Math.random() * 10)
    }
    wx.cloud.callFunction({
      name:'recordAdd',
      data:{
        collection:'activity',
        addData:{
          creation_date:creation_date,
          creation_timestamp:Date.parse(creation_date.replace(/-/g, '/')) / 1000,
          title:that.data.title,
          start_date:that.data.startTime,
          start_timestamp:Date.parse(that.data.startTime.replace(/-/g, '/')) / 1000,
          end_date:that.data.endTime,
          end_timestamp:Date.parse(that.data.endTime.replace(/-/g, '/')) / 1000,
          shopping:that.data.productList,
          act_code:code+numberCode,
          shop_code:userInfo.shop[userInfo.shop.length-1].shop_code,
          _openid:userInfo._openid,
          type:'team'
        }
      }
    }).then(res=>{
      console.log(res)
      wx.hideLoading()
      wx.showToast({
        title: '发布活动成功',
        icon:'success',
        duration:2000
      })
      setTimeout(res=>{
        wx.navigateBack({
          delta: 0,
        })
      },2000)
    }).catch(error => {
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      wx.showModal({
        title: '服务器繁忙，请稍后重试',
      })
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