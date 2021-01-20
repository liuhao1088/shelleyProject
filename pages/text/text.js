// pages/text/text.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lists: [{
      "name": '',
      "user": '',
    }],
    checkbox: [{
      id: 0,
      name: '行车记录仪',
      checked: false,
    }, {
      id: 1,
      name: '专车专用记录仪',
      checked: false,
    }, {
      id: 2,
      name: '智能车机',
      checked: false,
    }, {
      id: 3,
      name: '隐形车衣',
      checked: false,
    }],
    nowDate:'2020-12-22 18:00:00',
    countdown:'',   
    modalName:0,
    nowclientX: "",
    result: '',
    scanType: '',
    charSet: '',
    path: '',
    isOpen:false,
    
  },
  onAddPhone: function () {
    var lists = this.data.lists;
    var newData = {
      "name": '',
      "user": ''
    };
    // if (lists.length >= 3) {
    //   console.log('最多3个')
    //   return;
    // }
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

  // 倒计时
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

  hideModal(e) {
    this.setData({
      modalName: 1
    })
  },

  // 多选
  ChooseCheckbox(e) {
    console.log(e)
    let items = this.data.checkbox;
    let id = e.currentTarget.id;
    console.log(id)
    for (let i = 0; i < items.length; ++i) {
      if (items[i].id == id) {
        console.log(items[i].id)
        items[i].checked = !items[i].checked;
        break
      }
    }
    this.setData({
      checkbox: items
    })
  },



  // 获取手势
  touchstart(e) {
		console.log(e)
		this.setData({
			nowclientX: e.changedTouches[0].clientX
		})
	},
	touchend(e) {
		let nowclientX = this.data.nowclientX;
		let clientX = e.changedTouches[0].clientX;
		if (clientX > nowclientX) {
			console.log("向右滑动")
		} else {
			console.log("向左滑动")
		}
  },
  
  toIndex(){
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },

  getScancode: function () {
    var _this = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        var result = res.result;
        var scanType = res.scanType;
        var charSet = res.charSet;
        var path = res.path;
        _this.setData({
          result: result,
          scanType: scanType,
          charSet: charSet,
          path: path
        })
      }
    })
  },
  // 开关
  selSwitch(){
    let isOpen =  this.data.isOpen;
    isOpen	=!isOpen;
		this.setData({
			isOpen
		})
	},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.countTime();
    let that = this;
    setTimeout(function() {
      that.setData({
        loading: true
      })
    }, 500)
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