// pages/text/text.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [{
      "name": '',
      "user": ''
    }],
    nowDate:'2020-12-22 18:00:00',
    countdown:'',    
  },
  onAddPhone: function () {
    var lists = this.data.lists;
    var newData = {
      "name": '',
      "user": ''
    };
    if (lists.length >= 3) {
      console.log('最多3个')
      return;
    }
    lists.push(newData);
    this.setData({
      lists: lists,
    })
  },
  delList: function (e) {
    var nowidx = e.currentTarget.dataset.idx; //当前索引
    console.log(nowidx)
    var lists = this.data.lists;
    lists.splice(nowidx, 1);
    this.setData({
      lists: lists,
    })
  },
  bindPhoneDataChangname: function (e) {
    var nowIdx = e.currentTarget.dataset.idx; //获取当前索引
    this.data.lists[nowIdx].name = e.detail.value
    console.log(this.data.lists[nowIdx].name)

  },
  bindPhoneDataChanguser: function (e) {
    var nowIdx = e.currentTarget.dataset.idx; //获取当前索引
    this.data.lists[nowIdx].user = e.detail.value
    console.log(this.data.lists[nowIdx].user)
  },

  countTime() {
    let nowDate = this.data.nowDate;
    console.log(nowDate)
    let that = this;
    let now = new Date().getTime();
    let end = new Date(nowDate).getTime(); //设置截止时间
    console.log("开始时间："+now,"截止时间:"+end);
    let leftTime =  end -now;//时间差                         
    let h, m, s;
    if (leftTime >= 0) {
      h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
      m = Math.floor(leftTime / 1000 / 60 % 60);
      s = Math.floor(leftTime / 1000 % 60);
      s = s < 10 ? "0" + s : s
      m = m < 10 ? "0" + m : m
      h = h < 10 ? "0" + h : h
      that.setData({
        countdown: h + "：" + m + "：" + s,
      })
      //递归每秒调用countTime方法，显示动态时间效果
      setTimeout(that.countTime, 1000);
    } else {
      that.setData({
        countdown: '已截止'
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.countTime();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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