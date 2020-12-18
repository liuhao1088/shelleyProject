// pages/manage/examine/examine.js
var ind;
var skip;
var a_skip;
var list;
var alreadylist;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],scrollHev:'',startDate:'不限',endDate:'不限',search:'',alreadylist:[],
    tabs: [{
      title: "待认证",
      color: "orangered"
    }, {
      title: "已认证",
      color: ""
    }],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
  },
  toReturn: function () {
    wx.navigateBack({
      default: 1
    })
  },
    //tab菜单
    tabClick: function (e) {
      this.setData({
        sliderOffset: e.currentTarget.offsetLeft,
        activeIndex: e.currentTarget.id,
      });
  
      var tabs = this.data.tabs;
      for (let i = 0; i < 2; i++) {
        tabs[i].color = "black";
      }
      tabs[e.currentTarget.id].color = "orangered";
      this.setData({
        tabs: tabs
      })
      //console.log(e.currentTarget.id,this.data.tabs)
    },
  inputSearch(e) {
    var that = this;
    that.setData({search:e.detail.value})
  },
  search:function(){
    skip = 0;
    this.setData({
        list: []
    })
    this.loadData()
  },
  changeDate: function (e) {
    this.setData({ startDate: e.detail.value })
  },
  changeDate2: function (e) {
    this.setData({ endDate: e.detail.value })
  },
  toLookup: function (e) {
    var that = this;
    ind = parseInt(e.currentTarget.dataset.index)
    wx.setStorageSync("editData", that.data.list[ind])
    wx.navigateTo({
      url: './lookup',
    })
  },
  toAlreadyLookup: function (e) {
    var that = this;
    ind = parseInt(e.currentTarget.dataset.index)
    wx.setStorageSync("editData", that.data.alreadylist[ind])
    wx.navigateTo({
      url: './lookup',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          widheight: res.windowHeight,
          scrollHev:res.windowHeight-80
        });
      }
    });
    this.setData({list:[],alreadylist:[]})
    skip=0;
    list=this.data.list;
    alreadylist=this.data.alreadylist;
    this.loadData(list,'waiting')
    a_skip=0;
    this.loadData(alreadylist,'success')
    console.log(list,alreadylist)
    this.setData({list:list,alreadylist:alreadylist})
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
    let boolean=wx.getStorageSync('refresh');
    if(boolean==true){
      skip=0;
      this.setData({list:[]})
      this.loadData()
      wx.setStorageSync('refresh', false)
    }
  },
  loadData:function(arr,proveValue){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    let startstamp=Date.parse(that.data.startDate.replace(/-/g, '/')) / 1000
    let endstamp=Date.parse(that.data.endDate.replace(/-/g, '/')) / 1000
    if(that.data.startDate=='不限') startstamp=0
    if(that.data.endDate=='不限') endstamp=100000000000;
    const db = wx.cloud.database();
    const _=db.command;
    db.collection('shop').where(_.or([{
      phone: {
        $regex: '.*' + that.data.search,
        $options: 'i'
      }
    },{
      shop_name: {
        $regex: '.*' + that.data.search,
        $options: 'i'
      }
    },{
      person: {
        $regex: '.*' + that.data.search,
        $options: 'i'
      }
    },{
      address: {
        $regex: '.*' + that.data.search,
        $options: 'i'
      }
    }])).where({creation_timestamp:_.gte(startstamp).and(_.lte(endstamp+86400))}).where({prove:proveValue}).skip(skip).limit(20).orderBy("creation_date","desc").get().then(res => {
      let data = res.data;
      arr=arr.concat(data)
      console.log(arr)
      wx.hideLoading()
      wx.hideNavigationBarLoading()
    }).catch(error=>{
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      wx.showModal({
        title: '服务器繁忙，请稍后重试',
      })
    })
  },
  bindDownLoad: function () {
    console.log('--下拉刷新--')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    skip = skip + 20;
    list=this.data.list;
    this.loadData(list,'waiting')
    this.setData({list:list})
  },
  bindDownLoad: function () {
    console.log('--下拉刷新--')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    a_skip = a_skip + 20;
    alreadylist=this.data.alreadylist;
    this.loadData(alreadylist,'success')
    this.setData({alreadylist:alreadylist})
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