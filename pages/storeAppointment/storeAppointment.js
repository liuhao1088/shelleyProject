// pages/storeAppointment/storeAppointment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [
      ['00：00', '01：00'],
      ['00：00', '01：00']
    ],
    objectMultiArray: [
      [{
          id: 0,
          name: '00：00'
        },
        {
          id: 1,
          name: '01：00'
        }
      ],
      [{
          id: 0,
          name: '00：00'
        },
        {
          id: 1,
          name: '01：00'
        }
      ]
    ],
    multiIndex: [0, 0],
    checkbox: [{
      value: 0,
      name: '如影系列-R1',
      checked: false,
    }, {
      value: 1,
      name: '如影系列-R2',
      checked: false,
    }, {
      value: 2,
      name: '斑马系列-B2',
      checked: false,
    }, {
      value: 3,
      name: '斑马系列-B3',
      checked: false,
    }, {
      value: 4,
      name: '双色系列-S3',
      checked: false,
    }, {
      value: 5,
      name: '猎豹系列-T3',
      checked: false,
    }],
    nameList:'请选择想要体验的商品，可多选'
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    let nameList = [];
    let items = this.data.checkbox;
    for (let i = 0;i < items.length;i++) {
      if(items[i].checked == true){
        nameList.push(items[i].name);
      }
    }
    if(nameList == ''){
      nameList = ['请选择想要体验的商品，可多选'] 
    }
    this.setData({
      modalName: null,
      nameList
    })
    console.log(nameList)
  },
  ChooseCheckbox(e) {
   
    let items = this.data.checkbox;
    let values = e.currentTarget.dataset.value;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].value == values) {
        items[i].checked = !items[i].checked;
        break
      }
    }
    this.setData({
      checkbox: items,
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