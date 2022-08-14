// pages/sonShouye/headlineDetail/headlineDetail.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsDetailId:'',
    outerNet:'',
    newsInf:{},
    contactHotel:true
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
console.log('that.data.newsInf.outerNet',that.data.newsInf.outerNet)
wx.setClipboardData({
  data: that.data.newsInf.outerNet,
})
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var newsDetailId=options.id
       that.setData({
        newsDetailId:newsDetailId
       },()=>{
         that.newsDetail(that.data.newsDetailId)
       })
  },
/*   newsDetail(id){
      let that = this;
      db.collection("news").doc(id).get({
        success(res){ 
         console.log("数据获取成功啦",res);
          that.setData({
            outerNet: res.data.outerNet,
          })
          console.log("outerNet",that.data.outerNet);
        },
        fail(err){
          console.log("数据获取失败", err);
        }
      })
   
  }, */
  newsDetail(id){
    let that = this;
    db.collection("news").doc(id).get({
      success(res){ 
       console.log("数据获取成功啦",res);
       var newsInf=res.data    
        var start=that.timeToDate(res.data.time)
        var start1=that.dateToTime(start)
        var start2=that.timeToDate(start1)
        newsInf.converSionTime=start2
        that.setData({
          newsInf:newsInf,
        })
        console.log("newsInf",that.data.newsInf);
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

  },
         /*
      把年月日格式的时间转换成时间戳
  */
 dateToTime: function (str) {
  var replaceArr = ["年", "月"];
  for (var j = 0; j < replaceArr.length; j++) {
    str = str.replace(replaceArr[j], "/");
  };
  str = str.replace("日", "");
  var d1 = new Date(str);
  var dd1 = d1.getTime();
  return dd1;
},
timeToDate(num){
  var d = new Date(num)
  var y = d.getFullYear()
  var m = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
  var d = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
  return y + '-' + m + '-' + d
},
})