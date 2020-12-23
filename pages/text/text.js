// pages/text/text.js
var minOffset = 30;//最小偏移量，低于这个值不响应滑动处理
var minTime = 60;// 最小时间，单位：毫秒，低于这个值不响应滑动处理
var startX = 0;//开始时的X坐标
var startY = 0;//开始时的Y坐标
var startTime = 0;//开始时的毫秒数

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

  topSwiper(event) {
    let navId = event.detail.current; //获取swiper下标
    console.log(event.detail.current);
    if (navId === 1) {
      this.setData({
        modalName: 0
      })
    } else {
      this.setData({
        windowHeight: 1
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

  /**
   * 触摸结束事件，主要的判断在这里
   */
  touchEnd: function (e) {
    console.log('touchEnd', e)
    var endX = e.changedTouches[0].pageX;
    var endY = e.changedTouches[0].pageY;
    var touchTime = new Date().getTime() - startTime;//计算滑动时间
    //开始判断
    //1.判断时间是否符合
    if (touchTime >= minTime) {
      //2.判断偏移量：分X、Y
      var xOffset = endX - startX;
      var yOffset = endY - startY;
      console.log('xOffset', xOffset)
      console.log('yOffset', yOffset)
      //①条件1（偏移量x或者y要大于最小偏移量）
      //②条件2（可以判断出是左右滑动还是上下滑动）
      if (Math.abs(xOffset) >= Math.abs(yOffset) && Math.abs(xOffset) >= minOffset) {
        //左右滑动
        //③条件3（判断偏移量的正负）
        if (xOffset < 0) {
          console.log('向左滑动')
        } else {
          console.log('向右滑动')
        }
      } else if (Math.abs(xOffset) < Math.abs(yOffset) && Math.abs(yOffset) >= minOffset) {
        //上下滑动
        //③条件3（判断偏移量的正负）
        if (yOffset < 0) {
          console.log('向上滑动')
        } else {
          console.log('向下滑动')
          wx.navigateTo({
            url: '/pages/index/index',
          })
        }
      }
    } else {
      console.log('滑动时间过短', touchTime)
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