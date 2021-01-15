// pages/manage/live/live.js
var skip;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ 
      title: '直播' 
    }) 
    skip=0;
    this.loadData()
  },
  loadData:function(){
    var that=this;
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.database().collection('live').orderBy('creation_date','desc').skip(skip).limit(20).get().then(res=>{
      console.log(res)
      let data=that.data.list.concat(res.data);
      that.setData({list:data})
      wx.hideLoading({
        success: (res) => {},
      })
      if(res.data.length==0){
        wx.showToast({
          title: '没有更多直播',
          icon:'none',
          duration:1500
        })
      }
      if(data.length==0){
        wx.showToast({
          title: '暂无直播',
          icon:'none',
          duration:150000000
        })
      }
    })
  },
  toEdit:function(e){ 
    let ind=e.currentTarget.dataset.index; 
    wx.navigateTo({ 
      url: './edit?data='+JSON.stringify(this.data.list[ind]), 
    }) 
  }, 
  toAdd:function(){ 
    wx.navigateTo({ 
      url: './edit', 
    }) 
  },

  delete:function(e){
    var that=this;
    var ind=e.currentTarget.dataset.index;
    let list=that.data.list;
    wx.showModal({
      title: '删除该直播',
      success: function (res) {
        if(res.confirm){
          wx.showLoading({
            title: '删除中',
          })
          wx.setStorageSync('dlg',list[ind].live_img)
          wx.cloud.callFunction({
            name:"recordDelete",
            data:{
              collection:"live",
              where:{_id:list[ind]._id}
            }
          }).then(res=>{
            wx.hideLoading()
            wx.showToast({
              title: '删除成功',
              icon:'success',
              duration:1500
            })
            let img=wx.getStorageSync('dlg')
            wx.cloud.deleteFile({
              fileList: img,
              success: res => {
                // handle success
                console.log(res.fileList)
              },         
            }) 
            list.splice(ind,1)
            that.setData({list:list})
            wx.removeStorageSync('dlg')
          })
        }
        
      }
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
    if(wx.getStorageSync('refresh')){ 
      setTimeout(()=>{ 
        skip=0; 
        this.setData({list:[]}) 
        this.loadData() 
      },500) 
      wx.removeStorageSync('refresh') 
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
    skip=skip+20;
    this.loadData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})