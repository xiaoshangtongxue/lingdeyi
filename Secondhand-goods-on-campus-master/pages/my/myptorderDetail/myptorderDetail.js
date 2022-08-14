
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
    Type:['食堂外卖','甜品蛋糕','水果配送','超市代购','快递代取'],
    activeMenuIndex: 0,
    showCart: false,
    showSubGoods: false,
    order: initOrder,
    id:'',
    pnone:'',
    sendopenid:'',
    nickname:'',

    review: {
      hasMore: true,
      loading: false,
      page: 0,
    },

    info:{}


  },
  onLoad: function (options) {
    var that = this;
    this.setData({
      id:options.id
    })

    // 页面初始化 options为页面跳转所带来的参数
    console.log(this.data.id);
    this.id = options.id || 2
    this.loadData();
  
  
     console.log('******************');
     console.log(that.data.nickname);

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
    db.collection('ptjoborder').where({
      _id:id
    }
    ).get({
      success:function(res){
        console.log(res.data)
            that.setData({
              info: res.data[0]
            })
            db.collection('wxmember').where({
              _openid: res.data[0]._openid
           }).get().then(res => {

            console.log(res);
            that.setData({
              nickname: res.data[0].nickName,
              pnone: res.data[0].pnoneNumber
            })
        
           })
      

      }
    })
 

  },
  sendSure:function(){
    var that=this
 
    wx.showModal({
      title: '提示',
      content: '您确定已将物品送达？',
      success (res) {
        if (res.confirm) {
         
          db.collection('ptjoborder').where({
            _id:that.data.id
          }).get({
            success: function (res) {
        
              console.log('22222222222222222222222222');
              console.log(res.data);
              console.log(res.data[0].sendopenid);
              wx.cloud.callFunction({
                name:'sendptMsg',
                data: {
                      openid:res.data[0].sendopenid,
                      sendName:that.data.nickname,
                      sendPhone:that.data.pnone ,
                      ptjobPlace:res.data[0].ptjobPlace,
                      sendStatus:'已送达',
                }
            
              }).then(res => {
                   console.log('推送消息成功',res);
                   wx.showToast({
                    title: '已通知确认收货!',
                    icon: 'success',
                    duration: 2000
                  })
              }).catch(res => {
                console.log('推送消息失败',res);
              })
          
            }
          })
      
          console.log('用户点击确定')

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
     
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
 


   
  
})