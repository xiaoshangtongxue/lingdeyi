
const db = wx.cloud.database()
var app = getApp();
var initOrder = {
  totalNum: 0,
  totalPrice: 0,
  totalGoodsPrice: 0,
  totalPackingFee: 0,
  goodsNums: {},
  goods: []
}

Page({
  data: {
    tabs: ["详情信息"],
    activeIndex: 0,
    activeMenuIndex: 0,
    showCart: false,
    showSubGoods: false,
    order: initOrder,
    id:'',
    ptopenId:'',
    statusinfo:false,
    nickname:'',
    pnone:'',
    openid:'',

    review: {
      hasMore: true,
      loading: false,
      page: 0,
    },

    info:{}
  },
  onLoad: function (options) {
    this.setData({
      id:options.id,
      ptopenId:options.ptopenId
    })
    // 页面初始化 options为页面跳转所带来的参数
    this.id = options.id || 2
    this.loadData()
    // this.loadReview()
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  loadData() {
    var that = this;
    var id = this.data.id;
    console.log(id);
    wx.showNavigationBarLoading()
    db.collection('paotuiDatas').where({
      _id:id
    }
    ).get({
      success:function(res){
        console.log(res.data)
            that.setData({
              info: res.data[0]
            })
      
      

      }
    })
 

  },
  onShareAppMessage() {
    var {info:{seller_id, seller_name}} = this.data

    return {
      title: seller_name,
      path: `/pages/shop/show?id=${seller_id}`
    }
  },
  nowaddptpost() {
    var that=this
    wx.showToast({
      title: '正在加载中...',
      icon: 'loading',
      duration:2000
    });
    app.getopenid(res => {
      console.log("write cb res", res)
      that.setData({
        openid: res
      })
      that.register(()=>{
        that.Info(()=>{
          that.loadptjob();
        }
        )
      })
    })   
  },
  loadptjob(){
    var that = this;
    db.collection('paotuiDatas').where({
      _id:that.data.id
    }).get({
      success: function (res) {
        console.log('获取数据成功',res)
          if(res.data[0].isStatus === true){
            wx.showToast({
              title: '物品已被接单',
              icon: 'success',
              duration:2000
            });
          }else{
          
            wx.cloud.callFunction({
              // 云函数名称
            name: 'ptjobData',
                  // 传给云函数的参数
            data: {
              id:that.data.id,
              isStatus:true,
              status:'已接单'
            },
        success: function (res) {
        console.log('更新成功',res)
        db.collection('paotuiDatas').doc(that.data.id).get({
          success: function (res) {
            console.log('数据信息',res.data);
            db.collection('ptjoborder').add({
                data:{
              ptjobName:res.data.ptjobName,
              ptservePrice:res.data.ptservePrice,
              ptjobDescribe:res.data.ptjobDescribe,
              ptjobCampusIndex:res.data.ptjobCampusIndex,
              ptjobCampus:res.data.ptjobCampus,
              ptjobPhoneNumber:res.data.ptjobPhoneNumber,
              ptType:res.data.ptType,
              ptjobPlace:res.data.ptjobPlace,
              ptjobTime:res.data.ptjobTime,
              ptjobPrice:res.data.ptjobPrice,
              nickname:res.data.nickname,
              ptplaceSelect:res.data.ptplaceSelect,
              isStatus:true,
              status:'已接单',
              oderIsstatus:false,  //未送达
              orderinfo:'未完成',
              time:new Date().getTime(),
              ordertime:formatDate2(new Date().getTime()),
              sendName:'',
              sendPhone:'',
              sendStatus:'正在送达',
              sendopenid:res.data._openid,
              ptjobId:res.data._id,
              },
            })
            .then(res => {
              console.log(res)
              db.collection('ptjoborder').where({
                _id:res._id
              }).get({
                success: function (res) {
                  wx.cloud.callFunction({
                    name:'sendptMsg',
                    data: {
                          openid:res.data[0].sendopenid,
                          sendName:that.data.nickname,
                          sendPhone:that.data.pnone,
                          ptjobPlace:res.data[0].ptjobPlace,
                          sendStatus:res.data[0].sendStatus,
                    }
                
                  }).then(res => {
                       console.log('推送消息成功',res);
                       wx.navigateTo({
                        url: '/pages/my/myptorder/myptorder?ptjobId='+that.data.id +'&Number='+ '0'
                    })
                  }).catch(res => {
                    console.log('推送消息失败',res);
                  })
                },
                fail:function (res) {
                  console.log('调用失败',res)
                  
                }
            
              })
      
          
            })
            .catch(console.error)
      
          },
          fail: function (res) {
              console.log('获取失败', res)
          }
       })
        },
      fail: function (err) {
            console.log(err)
      },
      })
  

          }
      },
      fail: function (res) {
        console.log('获取失败', res)
    }
  
  })
   
  },
  register(complete){
    var that=this
      db.collection('wxmember').where({
         _openid: that.data.openid
      }).get().then(res => {
        console.log("会员信息",res.data.length);
        if(res.data.length==0){
          console.log("123",res.data.length);
          wx.showModal({
            content: '您还未授权登录，是否登录',
            success(rest){
            if(rest.confirm){
                  wx.navigateTo({
                    url: '/pages/my/mySetting/mySetting',
                  })
                }else if(rest.cancel){
                  wx.switchTab({
                    url: '/pages/shouye/shouye',
                  })
                }
            }
          })
           console.log("123456",that.data.pnone);
        }else{
          that.setData({
            nickname: res.data[0].nickName,
            pnone: res.data[0].pnoneNumber
          })
          console.log("已注册，可以发布", res);
        }
        if(complete){
          complete()
        }
      })
      .catch(err =>{
        console.log(err);
      })
  
  },
  Info(complete){
    var that=this
      db.collection('wxmember').where({
         _openid: that.data.openid
      }).get().then(res => {
        console.log("会员信息",res.data.length);
          that.setData({
            nickname: res.data[0].nickName,
            pnone: res.data[0].pnoneNumber
          })
          console.log("已注册，可以发布", res);
        if(complete){
          complete()
        }
      })
      .catch(err =>{
        console.log(err);
      })
  
  },

 statusInfo:function(){
  var that = this;
  db.collection('paotuiDatas').where({
    _id:that.data.id
  }).get({
    success: function (res) {
        that.setData({
          statusinfo:res.data.isStatus,
        })
    },
    fail: function (res) {
      console.log('获取失败', res)
  }

})
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
