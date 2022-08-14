
const db = wx.cloud.database()
const app = getApp()
Page({ 
  /**
   * 页面的初始数据
   */
  data: {
    orderFormInf: {},
    modtime:'',
    modorder_id:'',
    openid:''
  },

/*   changeShowStatus(){
    this.setData({
      contactHotel: true
    })
  }, */
/* copyPhone(){
  var that=this
  console.log('that.data.orderFormInf.GoodsWay',that.data.orderFormInf.GoodsWay)
  wx.setClipboardData({
    data: that.data.orderFormInf.GoodsWay,
  })
}, */
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that=this
   console.log('options',options)
    that.setData({
      orderFormId: options.orderFormId
    },()=>{
       console.log("订单ID",that.data.orderFormId);
       that.getOrderDetail(that.data.orderFormId)
    })
    
  },
    // 获取订单详情
 getOrderDetail(id){
  let that = this;
  db.collection("GoodsOrderInfo").doc(id).get({
    success(res){ 
     console.log("数据获取成功啦************",res);
      that.setData({
        orderFormInf: res.data,
      })
    },
    fail(err){
      console.log("数据获取失败", err);
    }
  })
 },
   //修改订单状态
 /*  _contacthotel(){
   this.setData({
      contactHotel: false
    }) 

  }, */
  _contacthotel() {
    var that=this;
    console.log('id',id);
    wx.showModal({
      content: '是否确认收货状态为已收货',
      success(res) {
        if (res.confirm) {        
                /*
      1、通过openid 查询退款所需要的参数并赋值
      2、调起修改状态函数
      3、成功后，返回值保存到数据库。更改订单状态
      */
     
     that.updateGoodsOrderInfo(that.data.orderFormId)
    //  that.modOrderInfoStatus(modorder_id,'已送达')
      } else if (res.cancel) {
       console.log('quxiao')
       }
     }
    })
  },
     // 修改书本信息到数据库
     updateGoodsOrderInfo(id){
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
            that.modOrderInfoStatus(that.data.modorder_id,'已送达',that.data.modtime,that.data.openid)
          })
          wx.navigateTo({
            url: '/pages/my/myorder/myorder?goCurrtab='+Number(0),
          })
        },
        fail: err => {
          console.log("添加数据库失败", err)
          wx.showToast({
            title: '修改失败',
            icon: 'loading',
            duration: 2000
          })
        }
  
      })
    },
      // 修改成功后取数据库数据
  getDataDetail(id,success){
    var that=this
    db.collection("GoodsOrderInfo").doc(id).get().then(res=>{
          console.log("res", res.data)
          that.setData({
            modtime:res.data.modtime,
            modorder_id:res.data.id,
            openid:res.data._openid
          });
          success()
        }).catch(res=>{
          console.log("请求失败", res)
        })
  },
  modOrderInfoStatus(id,GoodsStatus,givetime, Buyopenid){
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
      that.giveGoods(res.data.Buyopenid,id,res.data.GoodsName,res.data.orderNo,res.data.GoodsStatus,res.data.givetime,'联系商家，发送已送达物品的订单详情页截图')
          
        }).catch(res=>{
          console.log("请求失败", res)
        })
      },
      fail: function (err) {
        console.log(err)
      },
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
      // console.log("获取openid成功", openid)
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

