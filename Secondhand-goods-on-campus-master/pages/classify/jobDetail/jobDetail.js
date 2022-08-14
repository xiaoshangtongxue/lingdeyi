// pages/classify/jobDetail/jobDetail.js
const db = wx.cloud.database()
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobDetailInf:[],
    contactHotel: true,
  },
 // 是否显示联系内容
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
console.log('that.data.jobDetailInf.GoodsWay',that.data.jobDetailInf.jobWay)
wx.setClipboardData({
  data: that.data.jobDetailInf.jobWay,
})
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that=this
   var jobDetailId=options.id
      that.setData({
        jobDetailId:jobDetailId
      },()=>{
        that.jobDetail(that.data.jobDetailId)
      })
  },
  jobDetail(id){
      let that = this;
      db.collection("wxjobpost").doc(id).get({
        success(res){ 
         console.log("数据获取成功啦",res);
          that.setData({
            jobDetailInf: res.data,
          })
          console.log("bookDetailInf",that.data.jobDetailInf);
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
    wx.setNavigationBarTitle({
      title: '兼职详情'
    });
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标
    setTimeout(function () {
      wx.stopPullDownRefresh(); //停止加载
      wx.hideNavigationBarLoading(); //隐藏加载icon
    }, 2000)
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