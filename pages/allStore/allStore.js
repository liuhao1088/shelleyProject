// pages/allStore/allStore.js
var bmap = require('../../utils/bmap-wx.min.js')
var skip;
var search='';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addr:'中国',
    list:[],
    search:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    skip=0;
    this.load()
    var that=this;
    var BMap = new bmap.BMapWX({
      ak: 'yLnHh2rGyFiou5kZGVMtP0LLKWrXfr0i'
    });
    wx.getLocation({
      success(res) {
        console.log(res)
        const lat = res.latitude
        const lon = res.longitude
        BMap.regeocoding({
          location: lat + ',' + lon,
          success: function (res) {
            let com=res.originalData.result.addressComponent;
            let addr;
            if(com.city.length==3){
              if(com.province=='内蒙古自治区'){
                addr=com.province.substring(0,3)+'，'+com.city.substring(0,2)
              }else{
                addr=com.province.substring(0,2)+'，'+com.city.substring(0,2)
              }
            }else{
              if(com.province=='内蒙古自治区'){
                addr=com.province.substring(0,3)
              }else{
                addr=com.province.substring(0,2)
              }
            }
            that.setData({
              addr:addr,
              lon: lon,
              lat: lat
            })
          },
          fail: function (r) {
            console.log(r)
            wx.showToast({
              title: '请检查位置服务是否开启',
            })
          },
        });
      }
    })
  },
  
  inputSearch:function(e){
    let v=e.detail.value;
    switch(v){
      case '':
        search=''
        break;
      default:
        search=v;
        if(v.indexOf('0')!==-1){
          search=parseInt(v.substring(1))
        }
        if(v.indexOf('00')!==-1){
          search=parseInt(v.substring(2))
        }
        switch(/(^[0-9]*$)/.test(search)){
          case true:
            search=parseInt(search)
        }
    }
  },
  search(){
    switch(search){
      case NaN:
        search=''
    }
    this.setData({list:[]})
    skip=0;
    this.load()
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
  
  load:function(){
    var that=this;
    wx.showLoading({
      title: '加载中',
    })
    var _=wx.cloud.database().command;
    wx.cloud.database().collection('shop').where({prove:'success'}).where(_.or([{
      shop_code: {
        $regex: '.*' + search,
        $options: 'i'
      }
    }, {
      shop_name: {
        $regex: '.*' + search,
        $options: 'i'
      }
    },{shop_code:search}])).orderBy('shop_code','asc').skip(skip).limit(20).get().then(res=>{
      let data=res.data;
      wx.hideLoading({
        success: (res) => {},
      })
      for(let i=0;i<data.length;i++){
        switch(JSON.stringify(data[i].shop_code).length){
          case 1:
            data[i].code='00'+JSON.stringify(data[i].shop_code)
            break;
          case 2:
            data[i].code='0'+JSON.stringify(data[i].shop_code)
            break;
        }
        if(i+1==data.length){
          let all=that.data.list.concat(data)
          that.setData({list:all})
        }
      }
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
    skip=skip+20;
    this.load()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})