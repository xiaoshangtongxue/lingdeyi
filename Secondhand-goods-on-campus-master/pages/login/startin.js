// pages/home/home.js
const App = getApp()
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
      CODE:"",
      openid:"",
      phone: "",
      nickName:'',
      avatarUrl:'',
      userId:'',
      pnoneNumber:''
  },
    //获取通讯录Token
    getinfoAccessToken: function(userId) {
         var that = this;
         //获取通讯录Taccess_token API
         var url = 'https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=ww71f37f8749531b44&corpsecret=WVPI8lx3_8WDUdtY40P0MDYimnruLmr-z7qIqZxWAZU';
         wx.cloud.callFunction({
          name: "request",
          data:{
            url:url
          },
          success(res){
            that.getuserInfo(res.result.access_token,userId)
          },
          fail(res){
             console.log(res)
          }
      })
    
      },
  //获取accessToken
  getAccessToken: function() {
    var that = this;
    //获取access_token API
    var url = 'https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=ww71f37f8749531b44&corpsecret=HsW9Z2fKd2_KeLuDpdCQlPJFBsfSeGMgzhb8wvJL4Xw';
    // var url = 'https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=wwfdaa78889401daa3&corpsecret=HZ-QeP3Uj6dHTUwSQ-FI_hi9Y_QQoI2SrhjagZOnsRI';
    wx.cloud.callFunction({
      name: "request",
      data:{
        url:url
      },
      success(res){
        const ACCESSTOKEN= res.result.access_token;
        that.getUserid(ACCESSTOKEN);  
      },
      fail(res){
         console.log(res)
      }
  })
  },
//获取userID
  getUserid: function(ACCESSTOKEN) {

      var that = this;
      if(ACCESSTOKEN!=''){
        that.getlogin(()=>{
        //获取UseridAPI
         var url= 'https://qyapi.weixin.qq.com/cgi-bin/miniprogram/jscode2session?access_token='+ ACCESSTOKEN+ '&js_code='+that.data.CODE+'&grant_type=authorization_code';
         wx.cloud.callFunction({
          name: "request",
          data:{
            url:url
          },
          success(res){
               //成功获取Userid.
               console.log("getUserid--------------",res.result.userid);   
               that.getinfoAccessToken(res.result.userid)
          },
          fail(res){
             console.log(res)
          }
      })
        })
      }else{
          //若获取不到 则重新获取
          that.getAccessToken();
      }
  },
// 企业登录函数
  getlogin(success){
      var that=this
      wx.qy.login({
          success:function(res){
              var CODE=res.code
              console.log("CODE",res.code)
              that.setData({
                  CODE:CODE
              })
              success()
          }
      })
  },
   //获取成员信息
  getuserInfo:function(data_token,data_userid){
    var that = this;
    //获取成员信息接口
    var url = 'https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token='+ data_token+ '&userid=' + data_userid;
    wx.cloud.callFunction({
      name: "request",
      data:{
        url:url
      },
      success(res){
        console.log(res);
            if(res.result.name){
              wx.showToast({
                title: '授权验证成功',
                icon: 'success',
                duration: 2000,
                success(){
                that.setData({
                    nickName:res.result.name,
                    avatarUrl:res.result.avatar,
                    pnoneNumber:res.result.mobile,
                    userId:res.result.userid
                   }) 
                   var openid = that.data.openid;
                   var nickName=that.data.nickName;
                   var avatarUrl=that.data.avatarUrl;  
                   var newtime =formatDate2(new Date().getTime());
                   var pnoneNumber = that.data.pnoneNumber;
                   var userId= that.data.userId
          that.add(openid,nickName,avatarUrl,newtime,pnoneNumber,userId)
                  setTimeout(function() {
                    wx.switchTab({
                      url: '/pages/shouye/shouye'
                    })
                  },1000);
                }
              })
             }else{
              wx.showToast({
                title: '权限验证失败',
                icon: 'error',
                duration: 2000
            })
             }    
      },
      fail(res){
         console.log(res)
      }
  })
     },
     loginIn(){
      that.getAccessToken();
     },

       // 存入数据库
 add(openid,nickName,avatarUrl,newtime,pnoneNumber,userId){
  db.collection('wxmember').add({
    data: {
       _id:openid,
       nickName:nickName,
       avatarUrl:avatarUrl,
       registerTime:newtime,
       pnoneNumber:pnoneNumber,
       userId:userId
    },
    success: res => {
      console.log("添加数据库成功", res)
    
    },
    fail: err => {
      console.log("添加数据库失败", err)
 
    }
  })
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    App.getopenid(res => {
      console.log("write cb res", res)
      this.setData({
        openid: res
      })
      console.log("openid0",res)
      console.log('*******************',that.data.openid);
      //无需重复验证登录
      db.collection('wxmember').where({
        _openid: that.data.openid
     }).get().then(res => {
         console.log('6666666',res);
         if(res.data.length ==0){
          wx.showLoading({
            title: '正在验证权限...',
            success(){
              that.getAccessToken();
            }
          })
         }else{
          wx.switchTab({
            url: '/pages/shouye/shouye'
           })
         }
      
        })
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
    wx.hideHomeButton();
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
 
})
function formatDate2(time){
  var date = new Date(time);

  var year = date.getFullYear(),
      month = date.getMonth()+1,//月份是从0开始的
      day = date.getDate(),
      hour = date.getHours(),
      min = date.getMinutes(),
      sec = date.getSeconds();
  var newTime = year + '-' +
      (month < 10? '0' + month : month) + '-' +
      (day < 10? '0' + day : day) + ' ' +
      (hour < 10? '0' + hour : hour) + ':' +
      (min < 10? '0' + min : min) + ':' +
      (sec < 10? '0' + sec : sec);

  return newTime;
}