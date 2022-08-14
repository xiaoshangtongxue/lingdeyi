// pages/sonShouye/headline/headline.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headlineData: [],
    headlineDatalength:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('111')
    this.news()
  },
  news(){
    var that=this
    let len=that.data.headlineData.length
    db.collection('news').orderBy('time','desc')
    .skip(len).get({
      success: function (res) {
        console.log('获取数据成功',res.data) 
        var news=res.data
     for(var i=0;i<res.data.length;i++){
        console.log('news[i]',news[i]) 
        var start=that.timeToDate(res.data[i].time)
        var start1=that.dateToTime(start)
        var start2=that.timeToDate(start1)
        news[i].time=start2
       } 
       if (res.data.length<=0) {
        console.log("请求成功9", res.data.length)
        wx.showToast({
          icon:'none',
          title:"没有更多数据啦"
        })
        console.log("没有更多数据啦",)
      } 
       that.setData({
        headlineData: that.data.headlineData.concat(news)
       })

      },
      fail: function (res) {
          console.log('获取失败', res)
      }
   })
  },
  _goToDetail(e){
    var that=this
    var id = e.currentTarget.dataset.id;
    console.log('id', id);
    wx.navigateTo({
      url: '/pages/sonShouye/headlineDetail/headlineDetail?id=' + id, 
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
      title: '校园头条'
    });
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标
    setTimeout(function () {
      wx.stopPullDownRefresh(); //停止加载
      wx.hideNavigationBarLoading(); //隐藏加载icon
    }, 2000)
  },

  //页面上拉触底事件的处理函数
  onReachBottom: function() {
    console.log("执行")
    var that=this
    that.news()

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
