//my.js
const App = getApp()
const db = wx.cloud.database()
var openid=App.globalData.openid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      nickName: '点击登陆',
      avatarUrl: '', 
      userName:'点击登陆'
    },
    hasUserInfo: false,
    _openid:'',
    // canIUseGetUserProfile: false,
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  // 扫一扫
  getQRCode: function(){
    var _this = this;
    wx.scanCode({        //扫描API
      success: function(res){
        console.log('222',res);    //输出回调信息
        _this.setData({
          qRCodeMsg: res.result
        });
        wx.showToast({
          title: '成功',
          duration: 2000
        })
        wx.reLaunch({
          url: '/pages/getCodeInfo/getCodeInfo?scene='+res.result,
        })
      }
    })
  },
  onLoad: function () {    
    var that = this
   App.getopenid(res => {
    console.log("write cb res", res)
    this.setData({
      _openid: res
    })
    this.getUserInfo(res)
    console.log("openid0****",that.data._openid)
  })
  var openid=App.globalData.openid
  console.log("openid100",App.globalData.openid)
  },
  // getOpenid(completed){
  //   wx.cloud.callFunction({
  //     name: 'login',
  //     success: res =>{
  //       console.log('openid', res.result.openid);
        
  //       let openid = res.result.openid;
  //       completed(openid);
  //     },
  //     fail: err => {
        
  //     }
  //   })
  // },   
  // 从数据库取头像昵称
  getUserInfo(openid){
    let that = this;
      db.collection('wxmember').where({
         _openid: openid
      }).get().then(res => {
        console.log("会员信息", res);
        if(res.data.length==0){
          that.setData({
            userInfo: {
              nickName: '点击登陆',
              avatarUrl: '', 
            },
            _openid:openid,
            hasUserInfo: false,
          })
        }else{
          that.setData({
            userInfo: {
              nickName:res.data[0].nickName,
              avatarUrl:res.data[0].avatarUrl, 
              userName:res.data[0].userName,
            },
            _openid:openid,
            hasUserInfo: true,
          })
        }
      })
      .catch(err =>{
        console.log(err);
      })
    
  },
  goMySetting(){
    wx.navigateTo({
      url:"/pages/login/startin1",
      // success: function(res) {},
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that=this
    App.getopenid(res => {
      console.log("write cb res", res)
      that.setData({
        _openid: res
      })
      that.getUserInfo(res)
      console.log("openid12",res)
    })
  },

  /**
   * 生命周期函数--监听页面隐
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  onPullDownRefresh(){
    wx.setNavigationBarTitle({
      title: '我的信息'
    });
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标
    setTimeout(function () {
      wx.stopPullDownRefresh(); //停止加载
      wx.hideNavigationBarLoading(); //隐藏加载icon
    }, 2000)
  },
  bindClear: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '退出账号成功',
      success(res){
        if (res.confirm) {        
          db.collection('wxmember').where({
            _openid: that.data._openid
        }).get().then(res => {
          console.log("会员", res);
          var _id=res.data[0]._id
          db.collection('wxmember').doc(_id).remove({
            success: function(res){
              that.setData({
                userInfo: {
                  nickName: '点击登陆',
                  avatarUrl: '', 
                },
                hasUserInfo: false,
              })
              wx.switchTab({
                url: '/pages/my/my',
              })
            }
          })
        })
        .catch(err =>{
          console.log(err);
        })
      } else if (res.cancel) {
        wx.switchTab({
          url: '/pages/my/my',
        })

      }  
      }
    })
  },


})

