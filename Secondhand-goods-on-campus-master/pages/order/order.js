const db = wx.cloud.database()
const App = getApp()
Page({
  data: {
    currtab: 0,
    swipertab: [{ name: '已支付', index: 0 }, { name: '待收货', index: 1 },{ name: '已收货', index: 2 }],
    alreadyPayment:[],//已支付数据
    waitGoods:[],//待收货数据
    alreadyGoods:[], //已收货数据
    openid: "",
    orderFormId: "",
    modtime:''
  },
  onLoad(options){
    var that=this
/*     console.log("options",Number(options.goCurrtab))
    that.setData({
      currtab:Number(options.goCurrtab)
    }) */
    console.log("123",that.data.currtab)
   
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
    }else if(that.data.currtab==1){
      that.waitGoodsShow()
    }else{
      that.alreadyGoodsShow()
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
       alreadyPayment:[],//已支付数据
       waitGoods:[],//待收货数据
       alreadyGoods:[], //已收货数据
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
        case 2:
          that.alreadyGoodsShow()
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
        db.collection("GoodsOrderInfo").where({
          _openid:that.data.openid,
          orderStatus:'已支付'
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
         db.collection("GoodsOrderInfo").where({
            _openid:res,
            orderStatus:'已支付',
            GoodsStatus:'待收货'
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
    alreadyGoodsShow: function(){
      var that = this;
      App.getopenid(res => {
        console.log("write cb res", res)
        that.setData({
          openid: res
        })
      console.log("openid0",res)
      let  len=that.data.alreadyGoods.length
      console.log("请求成功7", len)
      db.collection("GoodsOrderInfo").where({
        _openid:res,
        orderStatus:'已支付',
        GoodsStatus:'已收货'
      })
      .orderBy('BuyTimeStamp','desc')
        .skip(len) //从第几个数据开始
        .get().then(res=>{
            console.log("请求成功8", res.data)
            if (res.data.length<=0) {
              console.log("请求成功9", res.data.length)
              wx.showToast({
                icon:'none',
                title:"没有更多数据啦"
              })
            } 
            that.setData({
              alreadyGoods: that.data.alreadyGoods.concat(res.data), //获取数据数组    
            });
          }).catch(res=>{
            console.log("请求失败", res)
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
    url: '/pages/my/myOrderDetail/myOrderDetail?orderFormId='+that.data.orderFormId+'&Index='+"0",
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
      url: '/pages/my/myOrderDetail/myOrderDetail?orderFormId='+that.data.orderFormId+'&Index='+"1",
    })
  },
  alreadyGoodsDetail(e){
    let that = this;
   console.log(e.currentTarget.id);
   that.setData({
      orderFormId: that.data.alreadyGoods[e.currentTarget.id]._id
    });
    console.log("ID", that.data.orderFormId);
    wx.navigateTo({
      url: '/pages/my/myOrderDetail/myOrderDetail?orderFormId='+that.data.orderFormId+'&Index='+"2",
    })
  },
  // 修改收货状态
  refMon:function (e) {
    var that=this;
    var id = e.currentTarget.id
    console.log('id',id);
    console.log('that.data.alreadyPayment',that.data.alreadyPayment);
    var order_id = that.data.alreadyPayment[id]._id
    var modorder_id = that.data.alreadyPayment[id].id
    console.log('order_id ',order_id );
    wx.showModal({
      content: '是否确认收货状态为已收货',
      success(res) {
        if (res.confirm) {        
                /*
      1、通过openid 查询退款所需要的参数并赋值
      2、调起修改状态函数
      3、成功后，返回值保存到数据库。更改订单状态
      */
       that.updateGoodsOrderInfo(order_id,modorder_id)
       } else if (res.cancel) {
       console.log('quxiao')
       }
     }
    })
  },
  refMonWait:function (e) {
    var that=this;
    var id = e.currentTarget.id
    console.log('id',id);
    var order_id = that.data.waitGoods[id]._id
    var modorder_id = that.data.waitGoods[id].id
    console.log('modorder_id ', modorder_id);
    console.log('order_id ',order_id );
    wx.showModal({
      content: '是否确认收货状态为已收货',
      success(res) {
        if (res.confirm) {        
                /*
      1、通过openid 查询退款所需要的参数并赋值
      2、调起修改状态函数
      3、成功后，返回值保存到数据库。更改订单状态
      */
     console.log('order_id',order_id);
     console.log('modorder_id',modorder_id);
     that.updateGoodsOrderInfo(order_id,modorder_id)
    //  that.modOrderInfoStatus(modorder_id,'已送达')
      } else if (res.cancel) {
       console.log('quxiao')
       }
     }
    })
  },
  modOrderInfoStatus(id,GoodsStatus,givetime,Buyopenid){
    var that=this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'modOrderInfoStatus',
      // 传给云函数的参数
      data: {
       id: id,
       GoodsStatus:GoodsStatus,
       givetime:givetime,
       account:false,
       Buyopenid:Buyopenid
      },
      success: function (rest) {
        console.log('更新成功',rest)
        db.collection("wxGoodsPost").doc(id).get().then(res=>{
          console.log("res", res.data)
     //  买家收到货后
        that.ReceivingGoods(res.data.GoodsName,res.data.orderNo,'已收货',res.data.givetime,'本次交易完成')
        // 买家收到货后点击修改收货状态后
        that.giveGoods(res.data._openid,id,res.data.GoodsName,res.data.orderNo,res.data.GoodsStatus,res.data.givetime,'联系商家，发送已送达物品的订单详情页截图')
          
        }).catch(errr=>{
          console.log("请求失败",errr)
        })
      },
      fail: function (err) {
        console.log(err)
      },
    })
  },
  // 修改成功后取数据库数据
  getDataDetail(id,success){
    var that=this
    db.collection("GoodsOrderInfo").doc(id).get().then(res=>{
          console.log("res", res.data)
          that.setData({
            modtime:res.data.modtime
          });
          success()
        }).catch(res=>{
          console.log("请求失败", res)
        })
  },

   // 修改书本信息到数据库
   updateGoodsOrderInfo(id,modorder_id){
    var that=this
    db.collection('GoodsOrderInfo').doc(id).update({
      data: {
        GoodsStatus:'已收货',
        modtime:formatDate2(new Date().getTime()),
      },
      success: res => {
        wx.showToast({
          title: '修改成功',
          icon: 'succes',
          duration: 2500,
          mask: true
        })
        that.getDataDetail(id,()=>{
          console.log("that.data.givetime",that.data.modtime)
          that.modOrderInfoStatus(modorder_id,'已送达',that.data.modtime,that.data.openid)
        

        })
        console.log("that.data.currtab",that.data.currtab)
        wx.navigateTo({
          url: '/pages/my/myorder/myorder?goCurrtab='+that.data.currtab,
        })
      },
      fail: err => {
        console.log("添加数据库失败", err)
        wx.showToast({
          title: '修改失败',
          icon: 'loading',
          duration: 2000
        })
        wx.navigateTo({
          url: '/pages/my/myorder/myorder?goCurrtab='+that.data.currtab,
        })
      }

    })
  },
  //  买家修改数据库后消息
  ReceivingGoods(GoodsName,orderNo,GoodsStatus,givetime,remark) {
      var that = this
      let openid = that.data.openid
      // console.log("获取openid成功", openid)
      wx.cloud.callFunction({
        name: "ReceivingGoods",
        data: {
          openid: openid,
          GoodsName:GoodsName,
          orderNo:orderNo,
          GoodsStatus: GoodsStatus,
          givetime:givetime,
          remark:remark,
        }
      }).then(res => {
       console.log("推送消息成功", res)
      }).catch(res => {
       console.log("推送消息失败", res)
      })
  
    },
 //  买家收到货后点击修改收货状态后给卖家发消息
 giveGoods(openid,orderFormId,GoodsName,orderNo,GoodsStatus,givetime,remark) {
      var that = this
      console.log("获取openid成功", openid)
      wx.cloud.callFunction({
        name: "giveGoods",
        data: {
          orderFormId:orderFormId,
          openid: openid,
          GoodsName:GoodsName,
          orderNo:orderNo,
          GoodsStatus: GoodsStatus,
          givetime:givetime,
          remark:remark,
        }
      }).then(res => {
       console.log("推送消息成功", res)
      }).catch(res => {
       console.log("推送消息失败", res)
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