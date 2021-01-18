// pages/manage/examine/examine.js
var ind;
var skip=0;
var skip2=0;
var skip3=0;
var skip4=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    scrollHev: '',
    startDate: '不限',
    endDate: '不限',
    search: '',
    alreadylist: [],
    faillist:[],
    modifylist:[],
    searchlist:'',
    tabs: [{
      title: "待认证",
      color: "orangered"
    }, {
      title: "待修改",
      color: ""
    }, {
      title: "已认证",
      color: ""
    }, {
      title: "已驳回",
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
    for (let i = 0; i < 4; i++) {
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
    that.setData({
      search: e.detail.value
    })
  },
  async search() {
    if(this.data.search==''){
      this.setData({searchlist:''})
    }else{
      let data=[];
      await this.loadData([], '',data,0).then(res=>data=res)
      this.setData({
        searchlist:data
      })
    }
    
  },
  changeDate: function (e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  changeDate2: function (e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  toLookup: function (e) {
    var that = this;
    ind = parseInt(e.currentTarget.dataset.index)
    let mold=e.currentTarget.dataset.mold;
    switch(mold){
      case 'waiting':
        wx.setStorageSync("editData", that.data.list[ind])
        break;
      case 'success':
        wx.setStorageSync("editData", that.data.alreadylist[ind])
        break;
      case 'fail':
        wx.setStorageSync("editData", that.data.faillist[ind])
        break;
      case 'modify':
        wx.setStorageSync("editData", that.data.modifylist[ind])
        break;
      default:
        wx.setStorageSync("editData", that.data.searchlist[ind])
    }
    wx.navigateTo({
      url: './lookup',
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    var that = this;
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          widheight: res.windowHeight,
          scrollHev: res.windowHeight - 50
        });
      }
    });
    
    let list = [];
    let alreadylist = [];
    let faillist=[];
    await this.loadData(this.data.list, 'waiting',list,0).then(res=>list=res)
    await this.loadData(this.data.alreadylist, 'success',alreadylist,0).then(res=>alreadylist=res)
    await this.loadData(this.data.faillist, 'fail',faillist,0).then(res=>faillist=res)
    this.modifyLoad()
    this.setData({
      list: list,
      alreadylist:alreadylist,
      faillist:faillist
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
    var that=this;
    if (wx.getStorageSync('refreshData')) {
      let data = wx.getStorageSync('refreshData');
      let list=that.data.list;
      list[ind].prove=data.prove;
      list[ind].checker=data.checker;
      list[ind].check_date=data.check_date;
      if(data.reason) list[ind].reason=data.reason;
      if(data.shop_code) list[ind].shop_code=data.shop_code;
      that.setData({list:list})
      wx.removeStorageSync('refreshData')
    }
    if (wx.getStorageSync('refresh')) {
      let data = wx.getStorageSync('refresh');
      let list=that.data.modifylist;
      list[ind]=data;
      that.setData({modifylist:list})
      wx.removeStorageSync('refresh')
    }
  },
  loadData: function (parse, proveValue,arr,skip) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    let startstamp = Date.parse(that.data.startDate.replace(/-/g, '/')) / 1000
    let endstamp = Date.parse(that.data.endDate.replace(/-/g, '/')) / 1000
    if (that.data.startDate == '不限') startstamp = 0
    if (that.data.endDate == '不限') endstamp = 100000000000;
    const db = wx.cloud.database();
    const _ = db.command;
    return new Promise((resolve, reject) => {
      db.collection('shop').where(_.or([{
        phone: {
          $regex: '.*' + that.data.search,
          $options: 'i'
        }
      }, {
        shop_name: {
          $regex: '.*' + that.data.search,
          $options: 'i'
        }
      }, {
        person: {
          $regex: '.*' + that.data.search,
          $options: 'i'
        }
      }, {
        address: {
          $regex: '.*' + that.data.search,
          $options: 'i'
        }
      }]).and([{
        prove: {
          $regex: '.*' + proveValue,
          $options: 'i'
        }
      }])).where({
        creation_timestamp: _.gte(startstamp).and(_.lte(endstamp + 86400))
      }).skip(skip).limit(20).orderBy("creation_date", "desc").get().then(res => {
        let data = res.data;
        arr = parse.concat(data)
        resolve(arr)
        wx.hideLoading()
        if(data.length==0){
          wx.showToast({
            title: '暂无更多数据',
            icon:'none',
            duration:1500
          })
        }
        wx.hideNavigationBarLoading()
      }).catch(error => {
        wx.hideLoading()
        wx.hideNavigationBarLoading()
        wx.showModal({
          title: '服务器繁忙，请稍后重试',
        })
      })
    })
  },
  modifyLoad:function(){
    var that=this;
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.database().collection('shop').where({prove:'success',modify:true}).orderBy('creation_timestamp','desc').skip(skip4).limit(20).get().then(res=>{
      let arr = that.data.modifylist.concat(res.data)
      that.setData({modifylist:arr})
      wx.hideLoading()
      wx.hideNavigationBarLoading()
    })
  },
  deleteFail: function (e) {
    var _this = this;
    ind = parseInt(e.currentTarget.dataset.index)
    let _id=_this.data.faillist[ind]._id
    console.log(ind)
    wx.showModal({
      title: '删除 '+_this.data.faillist[ind].shop_name,
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中',
          })
          wx.cloud.callFunction({
            name: 'recordDelete',
            data: {
              collection: 'shop',
              where: {
                _id: _id
              },
            }
          }).then(res => {
            wx.cloud.deleteFile({
              fileList: _this.data.faillist[ind].shop_img,
              success: res => {
                // handle success
                console.log(res.fileList)
              },
              fail: err => {
                // handle error
              },
              complete: res => {
                // ...
              }
            })
            _this.data.faillist.splice(ind, 1);
            wx.hideLoading({
              success: (res) => {},
            })
            wx.showToast({
              title: '删除成功',
              icon:'success',
              duration:2000
            })
            _this.setData({
              faillist: _this.data.faillist
            })
            skip3=0;
            let faillist=[]
            _this.setData({faillist:[]})
            _this.loadData(_this.data.faillist, 'fail',faillist,0).then(res=>faillist=res)
            setTimeout(()=>{
              _this.setData({faillist:faillist})
            },500)
          })

        }
      }
    })
  },
  async bindDownLoad(e) {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    let mold=e.currentTarget.dataset.mold;
    let list = [];
    switch(mold){
      case 'waiting':
        skip = skip + 20;
        await this.loadData(this.data.list, 'waiting',list,skip).then(res=>list=res)
        this.setData({
          list: list
        })
        break;
      case 'success':
        skip2 = skip2 + 20;
        await this.loadData(this.data.alreadylist, 'success',list,skip2).then(res=>list=res)
        this.setData({
          alreadylist: list
        })
        break;
      case 'fail':
        skip3 = skip3 + 20;
        await this.loadData(this.data.faillist, 'fail',list,skip3).then(res=>list=res)
        this.setData({
          faillist: list
        })
        break;
      default:
        skip4 = skip4 + 20;
        this.modifyLoad();
    }
    
    
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