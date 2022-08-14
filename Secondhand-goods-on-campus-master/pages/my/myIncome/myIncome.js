const db = wx.cloud.database()
const App = getApp()
Page({
  data: {
    currtab: 0,
    scrollTop:0,  //用作跳转后右侧视图回到顶部

    swipertab: [{ name: '未到账', index: 0 }, { name: '已到账', index: 1 }],
    alreadyPayment:[],//未到账数据
    waitGoods:[],//已到账数据
    openid: "",
    orderFormId: "",
    Buypnone:'',
    contactHotel: true,
  },
  onLoad(options){

  }, 
  onClick(event) {
    var that = this;
    that.setData({
      currtab:event.detail.name,
      // _id:options.id
    })
    that.orderShow();
    console.log('-------------------',that.data.currtab)

  },
  //页面显示的事件
  onShow:function() {
    console.log('执行111')
    this.alreadyPaymentShow()
  },
  //页面上拉触底事件的处理函数
  onReachBottom: function() {
    console.log("执行",)
    var that=this
    if(that.data.currtab==0){
      that.alreadyPaymentShow()
    }else{
      that.waitGoodsShow()
    } 
  },
   /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('执行')
    this.getDeviceInfo()
    //this.orderShow()
  },
  getDeviceInfo: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceW: res.windowWidth-50,
          deviceH: res.windowHeight-50
        })
      }
    })
  }, 
  /**
  * @Explain：选项卡点击切换
  */
 tabSwitch: function (e) {
  var that = this
  console.log('current1',e.target.dataset.current)
  if (that.data.currtab === e.target.dataset.current) {
    return false
  } else {
    that.setData({
      currtab: e.target.dataset.current
    })
  }
},

  tabChange: function (e) {
    console.log('current',e.detail.current)
    this.setData({
       currtab: e.detail.current,
       alreadyPayment:[],
       waitGoods:[],

      })
    console.log('执行222')
    this.orderShow()
  },
    orderShow: function () {
      let that = this
      switch (that.data.currtab) {
        case 0:
          that.alreadyPaymentShow()
          break
        case 1:
          that.waitGoodsShow()
          break
      }
    },
    alreadyPaymentShow: function(){
      var that = this;
      App.getopenid(res => {
        console.log("write cb res", res)
        that.setData({
          openid: res
      },()=>{
        console.log("openid0",res)
        let  len=that.data.alreadyPayment.length
        console.log("请求成功1", len)
        console.log("that.data.alreadyPayment", that.data.alreadyPayment)
        db.collection("wxGoodsPost").where({
          _openid:that.data.openid,
          status:'已售',
          account:false
        })
        .orderBy('BuyTimeStamp','desc')
          .skip(len) //从第几个数据开始
          .get().then(rest=>{
              console.log("请求成功2", rest.data)
              if (rest.data.length<=0) {
                console.log("请求成功3", rest.data.length)
                wx.showToast({
                  icon:'none',
                  title:"没有更多数据啦"
                })
              } 
              that.setData({
                alreadyPayment: that.data.alreadyPayment.concat(rest.data), //获取数据数组    
              });
            }).catch(res=>{
              console.log("请求失败", res)
            })
          })
      })
    },
    waitGoodsShow: function(){
      var that = this;
      App.getopenid(res => {
        console.log("write cb res", res)
        that.setData({
          openid: res
        },()=>{
          console.log("openid0",res)
          let  len=that.data.waitGoods.length
          console.log("请求成功4", len)
         db.collection("wxGoodsPost").where({
          _openid:that.data.openid,
          GoodsStatus:'已送达',
          status:'已售',
          account:true
          })
          .orderBy('BuyTimeStamp','desc')
            .skip(len) //从第几个数据开始
            .get().then(res=>{
                console.log("请求成功5", res.data)
                if (res.data.length<=0) {
                  console.log("请求成功6", res.data.length)
                  wx.showToast({
                    icon:'none',
                    title:"没有更多数据啦"
                  })
                } 
                that.setData({
                  waitGoods: that.data.waitGoods.concat(res.data), //获取数据数组    
                });
              }).catch(res=>{
                console.log("请求失败", res)
              })
        })
     
    })  
    },

  // 跳转到详情页
  alreadyPaymentDetail(e){
    var that=this
    console.log(e.currentTarget.id);
    that.setData({
      orderFormId: that.data.alreadyPayment[e.currentTarget.id]._id
    });
   console.log("ID", that.data.orderFormId);
   wx.navigateTo({
    url: '/pages/my/myIncomeDetail/myIncomeDetail?orderFormId='+that.data.orderFormId+'&Index='+"0",
   })
  },
  waitGoodsDetail(e){
    let that = this;
    console.log(e.currentTarget.id);
    that.setData({
      orderFormId: that.data.waitGoods[e.currentTarget.id]._id
    });
    console.log("ID", that.data.orderFormId);
    wx.navigateTo({
      url: '/pages/my/myIncomeDetail/myIncomeDetail?orderFormId='+that.data.orderFormId+'&Index='+"1",
    })
  },

  // 联系平台
  refMon1:function () {
    wx.navigateTo({
      url: '/pages/my/MerchantPlatform/MerchantPlatform',
    })
  },
  refMon:function (e) {
    var that=this;
    var id = e.currentTarget.id
    console.log('id',id);
    console.log('that.data.waitGoods',that.data.alreadyPayment);
    var order_id = that.data.alreadyPayment[id]._id
    console.log('order_id ',order_id );
     that.setData({
       contactHotel: false
     })
     console.log('order_id',order_id);
     that.getDataDetail(order_id)
  },

  changeShowStatus(){
    this.setData({
      contactHotel: true
    })
  },

  // 取数据库数据
  getDataDetail(id){
    var that=this
    db.collection("wxGoodsPost").doc(id).get().then(res=>{
          console.log("res", res.data)
          that.setData({
            Buypnone:res.data.Buypnone
          });
          wx.setClipboardData({
            data: that.data.Buypnone,
          })
        }).catch(res=>{
          console.log("请求失败", res)
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