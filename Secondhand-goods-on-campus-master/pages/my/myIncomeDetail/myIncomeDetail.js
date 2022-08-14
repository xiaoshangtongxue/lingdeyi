
const db = wx.cloud.database()
const app = getApp()
Page({ 
  /**
   * 页面的初始数据
   */
  data: {
    orderFormInf: {},
    contactHotel: true,
  },
  // 是否显示联系买家
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
copyPhone(){
  var that=this
  console.log('that.data.orderFormInf.GoodsWay',that.data.orderFormInf.Buypnone)
  wx.setClipboardData({
    data: that.data.orderFormInf.Buypnone,
  })
},
_contacthotelPlat(){
   wx.navigateTo({
     url: '/pages/my/MerchantPlatform/MerchantPlatform',
   })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that=this
   console.log('options',options)
    that.setData({
      orderFormId: options.orderFormId
    },()=>{
       console.log("订单ID",that.data.orderFormId);
       that.getOrderDetail(that.data.orderFormId)
    })
    
  },
    // 获取订单详情
 getOrderDetail(id){
  let that = this;
  db.collection("wxGoodsPost").doc(id).get({
    success(res){ 
     console.log("数据获取成功啦",res);
     var orderFormInf=res.data
     if(orderFormInf.account==true){
      orderFormInf['accountStatus']='已到账'
     }else{
      orderFormInf['accountStatus']='未到账'
     }
      that.setData({
        orderFormInf:orderFormInf,
      })
    },
    fail(err){
      console.log("数据获取失败", err);
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

