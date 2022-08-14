// pages/my/mySetting/mySetting.js
const App = getApp()
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
 numberShow:true,
//  UserInfoShow:true,
  openid:"",
  phone: "",
  nickName:'',
  avatarUrl:'',
  gender:'',
  hasUserInfo: false,
  canIUseGetUserProfile: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    App.getopenid(res => {
      console.log("write cb res", res)
      this.setData({
        openid: res
      })
      console.log("openid0",res)
    })  
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  //苹果和安卓手机兼容登录
  getUserProfile(e) {
    var  that=this;
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log('获取成功',res.userInfo)
          that.setData({
           hasUserInfo: true,
           nickName:res.userInfo.nickName,
           avatarUrl:res.userInfo.avatarUrl,
           gender:that.data.genderInfo
          })
          if(res.userInfo.gender==1){
            that.setData({
              genderInfo:'女'
            })
          }
          else if(res.userInfo.gender==0){
            that.setData({
              genderInfo:'男'
            })
          }else{
            that.setData({
              genderInfo:'未知'
            })  
          }
          var user_name = wx.getStorageSync('user_name');
          var  openid=that.data.openid
          var  nickName=that.data.nickName
          var  avatarUrl=that.data.avatarUrl
          var  genderInfo=that.data.genderInfo
          var  pnoneNumber=that.data.phone
          var newtime=formatDate2(new Date().getTime())
          console.log('--------------------------',user_name);
          that.add(openid,nickName,avatarUrl,newtime,genderInfo,pnoneNumber,user_name)
          // wx.navigateBack(1);
     
        },
        fail:function(err){
          console.log("获取失败",err)
          wx.showToast({
            title: '信息获取失败',
            icon: 'error',
            duration: 3000
          });
          wx.navigateBack(1)
         }
        
      })
  },
  getUserInfo(e) {
    var that = this;
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    that.setData({
     hasUserInfo: true,
     nickName:e.detail.userInfo.nickName,
     avatarUrl:e.detail.userInfo.avatarUrl,
     gender:that.data.genderInfo
    })
    if(e.detail.userInfo.gender==1){
      that.setData({
        genderInfo:'女'
      })
    }
    else if(e.detail.userInfo.gender==0){
      that.setData({
        genderInfo:'男'
      })
    }else{
      that.setData({
        genderInfo:'未知'
      })  
    }
    var user_name = wx.getStorageSync('user_name');
    var  openid=that.data.openid
    var  nickName=that.data.nickName
    var  avatarUrl=that.data.avatarUrl
    var  genderInfo=that.data.genderInfo
    var  pnoneNumber=that.data.phone
    var newtime=formatDate2(new Date().getTime())
    console.log('-------------**********-------------',e);
    that.add(openid,nickName,avatarUrl,newtime,genderInfo,pnoneNumber,user_name)
    // wx.navigateBack(1)
  },
  getPhoneNumber(e) {
    let that = this;
    //判断用户是否授权确认
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
          wx.showToast({
                title: '获取手机号失败',
                icon: 'none'
          })
          return;
    }
    wx.showLoading({
          title: '获取手机号中...',
    })
    console.log('123456 ',wx.cloud.CloudID(e.detail.cloudID))
    // console.log(JSON.stringify(e.detail.cloudID));
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action:'getcellphone',
        id:wx.cloud.CloudID(e.detail.cloudID), 
      },
      success: res => {
          if (res.result == null) {
                wx.showToast({
                      title: '获取失败,请重新获取',
                      icon: 'none',
                      duration: 2000
                })
                wx.hideLoading();
                return false;
          }else{
            wx.hideLoading();
            wx.showToast({
                  title: '获取成功',
                  icon: 'none',
                  duration: 2000
            })
          }
          //获取成功，设置手机号码
          that.setData({
            phone: res.result
          })
          that.setData({
            numberShow:false,
            getUserInfoShow:true,
          })
          console.log('执行到了',)
          console.log('getUserInfoShow',that.data.getUserInfoShow)
    },
    fail: err => {
          console.error(err);
          wx.hideLoading()
          wx.showToast({
                title: '获取失败,请重新获取',
                icon: 'none',
                duration: 2000
          })
    }
    })
    
  },
  // 存入数据库
 add(openid,nickName,avatarUrl,newtime,genderInfo,pnoneNumber,user_name){
  db.collection('wxmember').add({
    data: {
       _id:openid,
       nickName:nickName,
       avatarUrl:avatarUrl,
       registerTime:newtime,
       gender:genderInfo,
       pnoneNumber:pnoneNumber,
       userName:user_name
    },
    success: res => {
      console.log("添加数据库成功", res)
      wx.navigateBack({
        delta:1 //返回上一级页面
      })
    },
    fail: err => {
      console.log("添加数据库失败", err)
      wx.navigateBack({
        delta:1 //返回上一级页面
      })
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
};