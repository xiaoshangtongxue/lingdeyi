// pages/my/MerchantPlatform/MerchantPlatform.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailInfo:{},
    contactHotel: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('11')
    this.getCode()
  },
getCode(){
  var that=this
  db.collection("merchantPlatform")
    .get().then(res=>{
        console.log("请求成功2", res.data[0])
        that.setData({
          detailInfo:res.data[0]
        });
        console.log(" detailInfo",that.data.detailInfo)
      }).catch(res=>{
        console.log("请求失败", res)
      })
},
// 是否显示联系
_contacthotel(){
  this.setData({
    contactHotel: false
  })
},
changeShowStatus(){
  this.setData({
    contactHotel: true
  })
},
// 拨号
_dial(){
   var that=this
 wx.makePhoneCall({
  phoneNumber: that.data.detailInfo.phone,
})
},
// 添加到通讯录
addPhone(){
  var that=this
  console.log(that.data.detailInfo.phone)
wx.addPhoneContact({
  firstName: '商家平台',
  mobilePhoneNumber: that.data.detailInfo.phone
})
},
copyPhone(){
  var that=this
wx.setClipboardData({
  data: that.data.detailInfo.phone,
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
    console.log('22')
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