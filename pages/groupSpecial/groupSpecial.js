// pages/groupSpecial/groupSpecial.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList: [{
        img: '',
        name: '微信头像1',
        time: '00:09:25'
      },
      {
        img: '',
        name: '微信头像2',
        time: '00:40:25'
      },
      {
        img: '',
        name: '微信头像3',
        time: '00:32:25'
      }
    ],
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
    nowDate:'2020-12-22 18:00:00',//结束时间
    countdown:'', //倒计时
    days:'00',//天
    hours:'00',//时
    minutes:'00',//分
    seconds:'00',//秒
    data:'',avatarUrl:'',waresInd:'',userInfo:''
  },
  toActivityRule(event) {
    wx.navigateTo({
      url: '/pages/activityRule/activityRule',
    })
  },
  toMyCoupon(event) {
    wx.navigateTo({
      url: '/pages/myCoupon/myCoupon',
    })
    this.hideModal();
  },
  toReserveStore(e) {
    wx.navigateTo({
      url: '/pages/reserveStore/reserveStore',
    })
    this.setData({
      modalName: null
    })
  },

  //弹窗
  showModal(e) {
    let that = this;
    let target = e.currentTarget.dataset.target;
    let ind=e.currentTarget.dataset.index;
    that.setData({waresInd:ind})
    console.log(that.data.waresInd)
    if (target === 'goGroupSuccess') {
      wx.showLoading({
        title: '加载中...',
      })
      setTimeout(function () {
        that.setData({
          modalName: target
        })
        wx.hideLoading({
          success: (res) => {},
        })
      }, 1000)

    } else {
      that.setData({
        modalName: target
      })
    }
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  goGroupSuccessModal(e) {

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

  //倒计时
  countTime() {
    let nowDate = this.data.nowDate;
    console.log(nowDate)
    let that = this;
    let now = new Date().getTime();
    let end = new Date(nowDate).getTime(); //设置截止时间
    console.log("开始时间：" + now, "截止时间:" + end);
    let leftTime = end - now; //时间差                         
    let day, hou, min, sec;
    if (leftTime >= 0) {
      day = Math.floor(leftTime / 1000 / 60 / 60 / 24);
      hou = Math.floor(leftTime / 1000 / 60 / 60 % 24);
      min = Math.floor(leftTime / 1000 / 60 % 60);
      sec = Math.floor(leftTime / 1000 % 60);
      day = day < 10 ? "0" + day : day
      sec = sec < 10 ? "0" + sec : sec
      min = min < 10 ? "0" + min : min
      hou = hou < 10 ? "0" + hou : hou
      that.setData({
        countdown: hou + ":" + min + ":" + sec,
        day,
        hou,
        min,
        sec
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
    var that = this;
    wx.cloud.callFunction({
      name: 'multQuery',
      data: {
        collection: 'activity',
        match: {
          type: 'team'
        },
        or: [{}],
        and: [{}],
        lookup: {
          from: 'shop',
          localField: 'shop_code',
          foreignField: 'shop_code',
          as: 'shop',
        },
        lookup2: {
          from: 'user',
          localField: '_openid',
          foreignField: '_openid',
          as: 'user',
        },
        sort: {
          creation_date: -1
        },
        skip: 0,
        limit: 10
      }
    }).then(res => {
      let data=res.result.list[0];
      if(wx.getStorageSync('userInfo')){
        let userInfo=wx.getStorageSync('userInfo')
        that.setData({userInfo:userInfo})
        let cou = userInfo.coupon.filter(item => item.act_id.indexOf(data._id)!==-1)
        for(let i in data.shopping){
          for(let u in cou){
            if(i==cou[u].shopping_ind){
              data.shopping[i].status=true
              that.setData({data:data})
            } 
          }
        }
      }
      let nowstamp=Date.parse(util.formatTimes(new Date()).replace(/-/g, '/')) / 1000
      that.setData({data:data})
      if(data.end_timestamp>nowstamp){
        let int=setInterval(() => {
          nowstamp=nowstamp+1;
          if(nowstamp>=data.end_timestamp){
            that.setData({days:'00',hours:'00',minutes:'00',seconds:'00'})
            clearInterval(int);
          }
          let surplus = data.end_timestamp - nowstamp;
          let days = Math.floor(surplus / (60 * 60 * 24));
          if (days < 10) days = '0' + days;
          let hours = Math.floor((surplus / (60 * 60)) % 24);
          if (hours < 10) hours = '0' + hours;
          let minutes = Math.floor((surplus / 60) % 60);
          if (minutes < 10) minutes = '0' + minutes;
          let seconds = Math.floor((surplus) % 60);
          if (seconds < 10) seconds = '0' + seconds;
          that.setData({
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds
          })
        }, 1000);
      } else {
        that.setData({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00'
        })
      }
    })
  },
  increase:function(shape,mol,indx){
    var that=this;
    wx.showLoading({title:'拼团中'})
    let userInfo=wx.getStorageSync('userInfo')
    this.setData({avatarUrl:userInfo.avatarUrl})
    let team=[];
    let obj={};
    obj._openid=userInfo._openid;
    obj.nickName=userInfo.nickName;
    obj.avatarUrl=userInfo.avatarUrl;
    team.push(obj)
    let code = "";
    for (let e = 0; e < 10; e++) {
      code += Math.floor(Math.random() * 10)
    }
    wx.cloud.callFunction({
      name:'recordAdd',
      data:{
        collection:'coupon',
        addData:{
          creation_date:util.formatTimes(new Date()),
          creation_timestamp:Date.parse(util.formatTimes(new Date()).replace(/-/g, '/')) / 1000,
          cou_code:code,
          _openid:userInfo._openid,
          user:userInfo.nickName,
          shop_code:that.data.data.shop_code,
          shop_id:that.data.data.shop[0]._id,
          act_code:that.data.data.act_code,
          act_id:that.data.data._id,
          shopping:that.data.data.shopping[indx],
          shopping_ind:indx,
          team:team,
          status:shape
        }
      }
    }).then(res=>{
      console.log(res)
      let data=that.data.data;
      data.shopping[indx].status=true
      that.setData({modalName:mol,avatarUrl:'',data:data})
      wx.hideLoading()
    }).catch(error => {
      wx.hideLoading({
        success: (res) => {},
      })
      wx.showModal({
        showCancel: false,
        title: '系统繁忙，请稍后重试'
      })
    })      
  },
  joinGroup:function(e){
    var that=this;
    wx.requestSubscribeMessage({
      tmplIds: ['Ggdc3CQ1c6V0ss6ZvsMnExScZjPHZ0-8_OFdCJRTubA'],
      success (res) {
        console.log(res)
        if(res.pvZ2jnDjUwfpT2bpby2SxP5P1tcl3LXcn9RfOc8ibuI=='accept'){
          that.increase('success','goGroupSuccess',that.data.waresInd);
        }
      }
    })  
  },
  launchGroup:function(e){
    var that=this;
    let ind=e.currentTarget.dataset.index;
    wx.requestSubscribeMessage({
      tmplIds: ['Ggdc3CQ1c6V0ss6ZvsMnExScZjPHZ0-8_OFdCJRTubA'],
      success (res) {
        if(res.pvZ2jnDjUwfpT2bpby2SxP5P1tcl3LXcn9RfOc8ibuI=='accept'){
          that.setData({waresInd:ind})
          that.increase('waiting','initiateGroup',ind);
        }
      }
    }) 
  },
  toJoin:function(){
    if(wx.getStorageSync('userInfo')){

    }else{
      this.selectComponent("#authorize").showModal();
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (e) {
    
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
  onShareAppMessage: function (res) {

    if (res.from === 'button') {
      console.log(res.from)
      return {
        title: "【仅剩1个名额】我领了100元拼团券，快来助我成团激活~", //分享标题
        imageUrl: 'https://img13.360buyimg.com/ddimg/jfs/t1/121210/17/18389/166336/5faca14cE7949307a/1da2d6b96122e01d.jpg', //图片路径
        path: 'pages/groupSpecial/groupSpecial'
      }
    } else {
      console.log("1111")
    }
  }
})