// pages/helpAndFeedback/helpAndFeedback.js
var app=getApp()
var util=require('../../utils/util')
var index=5;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: [],
    content:'',
    contact:'',
    typeList: [{
        id: 0,
        icon: 'icontousu',
        name: '门店投诉',
        checked: false,
      },
      {
        id: 1,
        icon: 'iconflag',
        name: '活动建议',
        checked: false,
      },
      {
        id: 2,
        icon: 'iconcaozuo',
        name: '操作体验',
        checked: false,
      },
      {
        id: 3,
        icon: 'icongongneng',
        name: '功能建议',
        checked: false,
      },
      {
        id: 4,
        icon: 'iconbug',
        name: 'BUG反馈',
        checked: false,
      },
      {
        id: 5,
        icon: 'iconother',
        name: '其他反馈',
        checked: false,
      }
    ]
  },
  ChooseImage() {
    var that = this;
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        this.setData({
          img: res.tempFilePaths
        })
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.img,
      current: e.currentTarget.dataset.url
    });
  },

  DelImg(e) {
    let img = this.data.img;
    wx.showModal({
      content: '确定要删除图片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          img.splice(0, 1);
          this.setData({
            img
          })
        }
      }
    })
  },

  chooseCheckbox(e) {
    let typeList = this.data.typeList;
    index = e.currentTarget.dataset.index;
    for (let i in typeList) typeList[i].checked = false
    typeList[index].checked = true;
    this.setData({
      typeList
    })
  },
 
  inputContent:function(e){
    this.setData({content:e.detail.value})
  },
  inputContact:function(e){
    this.setData({contact:e.detail.value})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  async submit(){
    var that=this;
    if(that.data.content==''){
      wx.showToast({
        title: '反馈内容不能为空',
        icon:'none',
      })
      return
    }
    let fb_img=[];
    wx.showLoading({
      title: '提交中',
    })
    if(that.data.img!=='') await util.uploadimg(0,that.data.img,'feedback',fb_img)
    let data={
      creation_date: util.formatTimes(new Date()),
      creation_timestamp: Date.parse(util.formatTimes(new Date()).replace(/-/g, '/')) / 1000,
      _openid:app.globalData.openid,
      fb_type:that.data.typeList[index].name,
      fb_content:that.data.content,
      fb_contact:that.data.contact,
      fb_img:fb_img,
    }
    util.add('feedback',data).then(res=>{
      wx.hideLoading({
        success: (res) => {},
      })
      wx.showToast({
        title: '提交成功',
        icon:'success',
        duration:1500
      })
      setTimeout(()=>{
        wx.navigateBack({
          delta: 0,
        })
      },1500)
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