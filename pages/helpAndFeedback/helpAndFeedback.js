// pages/helpAndFeedback/helpAndFeedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop_img: [],
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

  chooseCheckbox(e) {
    let typeList = this.data.typeList;
    let index = e.currentTarget.dataset.index;
    for (let i in typeList) typeList[i].checked = false
    typeList[index].checked = true;
    this.setData({
      typeList
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