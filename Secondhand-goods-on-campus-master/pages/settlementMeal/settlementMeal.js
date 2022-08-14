// pages/settlement/settlement.js
const qrcode= require('../../utils/weapp.qrcode.js')
const db = wx.cloud.database()
const App = getApp()
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    nickname:'',
    pnone:'',
    address:'',
    foodArrid:[],
    orders:[],
    length:0,
    totalPrice:0,
    orderCode:'',
    _id:'',
    cartsId:[],
    Number:'0',
    orderNo:'',
    BuyTime:'',
    BuyTimeStamp:'',
    integral:1,
    buyNum:1,
    listNum:[],
    newOrders:[],
    Note:'', //备注信息
    foodId:'',
    Package_food:[],
    Package_food1:[],
    breakfast:'',
    lunch:'',
    dinner:'',
    codeImg:'',
    datainfo:1,
    Note:'',
    Package_time:'',
    isstatus:'',
    orderid:'',
    gettime:'',
    takeTime:[]
  },
  // timetap:function (e) {    //校区

  //   this.setData({
  //     takeTimeIndex: e.detail.value
  //   })
    
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
  
    App.getopenid(res => {
      console.log("write cb res", res)
      that.setData({
        openid: res
      })
    })
      console.log('options------------------------',options);
      console.log('openid------------------------',that.data.openid);
      var  foodId = options.foodId;
      that.setData({
        nickname:options.nickname,
        pnone:options.pnone,
        foodId:foodId,
        buyNum:options.buyNumber,
        breakfast:options.breakfast,
        lunch:options.lunch,
        dinner:options.dinner,
        datainfo:Number(options.info),
        Note:options.Note,
        Package_food1:options.Package_food,
        Package_time:options.Package_time,
        isstatus: options.isstatus,
        orderid:options.id,
        gettime:options.gettime
      },()=>{
          if(that.data.Note == undefined){
            that.data.Note = '无';
          }
          that.getGoodsCartList1()
      })
      
      if(that.data.isstatus == 'true'){
        that.getmyQrcode();
      }else{
        console.log('未接单不能生成验证码');
      }
      // console.log('Number',that.data.Number);
      // var len = wx.getStorageSync('goodslen');
      // that.setData({
      //   buyNum:len,
      // })

  },
  //输入信息
  _handleInputName: function (e) {
    console.log("姓名", e)
    this.setData({
      nickname: e.detail.value
    })

  },
  //手机信息
  _handleInputPhone: function (e) {
     console.log("电话", e)
    this.setData({
      pnone: e.detail.value
    })
  },
  _handleInputNote:function (e){

    this.setData({
      Note: e.detail.value
    })
  },

// 获取物品详情
  getGoodsCartList1(){
      console.log(1);
      var that = this;
      console.log('id信息',that.data.foodId);
        db.collection('paotuiDatas').doc(that.data.foodId).get({
          success: function (res) {
              var orders=res.data;
              var list = [];
              orders.buyLen =that.data.buyNum;
               that.setData({
                orders: that.data.orders.concat(orders),
                takeTime:orders.Package_time
              })
              console.log('*************',that.data.orders);
              var breakfast = that.data.breakfast.split(',');
              var lunch = that.data.lunch.split(',');
              var dinner = that.data.dinner.split(',');
              // console.log('77777',breakfast);
              if(that.data.orders[0].Package_food.length == 1){
                that.data.orders[0].Package_food[0].forEach((item,index)=>{
                  if(breakfast[0] !== ''){
                   for(var i = 0 ;i < breakfast.length;i++){
                     if(breakfast[i] == index){
           
                       list.push(item.val)
                     }
                   }
                  }
                })
              }else if(that.data.orders[0].Package_food.length == 2){
                that.data.orders[0].Package_food[0].forEach((item,index)=>{
                  if(breakfast[0] !== ''){
                   for(var i = 0 ;i < breakfast.length;i++){
                     if(breakfast[i] == index){
           
                       list.push(item.val)
                     }
                   }
                  }
                })
                that.data.orders[0].Package_food[1].forEach((item,index)=>{
       
                  if(lunch[0] !==''){
                    for(var i = 0 ;i < lunch.length;i++){
                      
                      if(lunch[i] == index){
                           console.log('++++++++++++++++++++++++',item.val);
                        list.push(item.val)
                      }
                    }
                  }
                
               })
              }else{
                that.data.orders[0].Package_food[0].forEach((item,index)=>{
                  if(breakfast[0] !== ''){
                   for(var i = 0 ;i < breakfast.length;i++){
                     if(breakfast[i] == index){
           
                       list.push(item.val)
                     }
                   }
                  }
                })
                that.data.orders[0].Package_food[1].forEach((item,index)=>{
       
                  if(lunch[0] !==''){
                    for(var i = 0 ;i < lunch.length;i++){
                      
                      if(lunch[i] == index){
                           console.log('++++++++++++++++++++++++',item.val);
                        list.push(item.val)
                      }
                    }
                  }
                
               })
               that.data.orders[0].Package_food[2].forEach((item,index)=>{
                if(dinner[0] !== ''){
                  for(var i = 0 ;i < dinner.length;i++){
                    if(dinner[i] == index){
               
                      list.push(item.val)
                    }
                  }
                }
            
             })
              }
             
          that.setData({
            Package_food:list
          })
     
          },
          fail: function (res) {
              console.log('获取失败', res)
          }
       })
      
    },
  // 支付订单号
  createOrderCode() {
    let orderCode = '';
    for (var i = 0; i < 6; i++) {
      orderCode += Math.floor(Math.random() * 10);
    }
    orderCode = new Date().getTime() + orderCode;
    this.setData({
      orderCode: orderCode
    });
  },
  // 订单编号
  orderNo(complete){
    var that=this
    let orderNo = '';
    for (var i = 0; i < 6; i++) {
      orderNo += Math.floor(Math.random() * 10);
    }
    console.log('orderNo')
    orderNo = new Date().getTime() + orderNo;
    that.setData({
      orderNo: orderNo
    });
    if(complete){
      complete()
    }
  },



  //检测库存数量
  // async checkNum(){
  //    var that = this;
  //    var orders = that.data.orders;
  //    for(var i = 0; i < orders.length ;i++){
  //     let res = await db.collection('wxGoodsPost').doc(orders[i]._id).get(
  //      )
  //      orders[i].GoodsNum = res.data.GoodsNum;
  //    }
  //    that.setData({
  //      orders:orders,
  //    })


  // },
  
    // /*下单成功后给买家发送模板消息 , customNum, date*/
    // SoldOut(orderFormId,openid,GoodsName,nickName,GoodsWay,address,remark) {
    //   var that = this
    //   console.log("获取openid成功", openid)
    //   console.log("GoodsName", GoodsName)
    //   console.log("nickName", nickName)
    //   console.log("GoodsWay", GoodsWay)
    //   console.log("remark", remark)
    //   wx.cloud.callFunction({
    //     name: "SoldOut",
    //     data: {
    //       orderFormId:orderFormId,
    //       openid: openid,
    //       GoodsName: GoodsName,
    //       nickName: nickName,
    //       GoodsWay: GoodsWay,
    //       address: address,
    //       remark: remark,
    //     }
    //   }).then(res => {
    //    console.log("推送消息成功", res)
    //   }).catch(res => {
    //    console.log("推送消息失败", res)
    //   })
  
    // },
    //  /*下单成功后给卖家发送模板消息 , customNum, date*/
    //  alreadyBuy(openid,GoodsName,nickName,GoodsWay,address,remark) {
    //   var that = this
    //   console.log("获取openid成功", openid)
    //   wx.cloud.callFunction({
    //     name: "alreadyBuy",
    //     data: {
    //       openid: openid,
    //       GoodsName:GoodsName,
    //       nickName:nickName,
    //       GoodsWay:GoodsWay,
    //       address:address,
    //       remark: remark,
    //     }
    //   }).then(res => {
    //    console.log("推送消息成功", res)
    //   }).catch(res => {
    //    console.log("推送消息失败", res)
    //   })
  
    // },
 
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

  // 提交订单
  tosubmit(){
    var that=this; 
    // that.timer();
    console.log('that.data.nickname', that.data.nickname);
    console.log('that.data.pnone',that.data.pnone);
    console.log('that.data.address',that.data.Note);
    if(that.data.nickname == ''||that.data.pnone == '' ){
      wx.showToast({
        title: '您还有信息未填',
        icon: 'none',
        duration: 1500
      })
      return;
    }else{
      wx.showModal({
        title: '提示',
        content: '确定要订餐吗?',
        success (res) {
          if (res.confirm) {
            Dialog.alert({
              title: '温馨提示',
              message: '请及时取餐,未取餐者会被列入失信人员名单！！！',
              theme: 'round-button',
            }).then(() => {
             
              var timer = that.data.gettime;
              var buynum = 1;
              var dataIndex;
              console.log('********taketime',that.data.takeTime[0]);
              that.data.takeTime[0].forEach((item,index)=> {
                if(item.val == timer){
                  buynum = Number(item.num);
                  dataIndex = index
                  return;
                }
              })
              console.log('+++++++++++++++++',that.data.orders[0].buyLen,buynum,dataIndex);
              if( Number(that.data.orders[0].buyLen) > buynum){
                Dialog.alert({
                  title: '对不起',
                  message: '当前取餐时间段的订餐人数过多,餐品剩余数量为:'+ buynum,
                })
              }else{
            
                that.createOrderCode();
                var orderCode = that.data.orderCode;
                var Package_Phone = that.data.orders[0].Package_Phone;
                var Package_name = that.data.orders[0].Package_name;
                var Package_no = that.data.orders[0].Package_no;
                var buyopenid = that.data.orders[0]._openid;
                var imgArr = that.data.orders[0].imgArr;
                var nickname = that.data.nickname;
                var ptjobCampus = that.data.orders[0].ptjobCampus;
                var sellopenid = that.data.orders[0].sellopenid;
                var Package_food = that.data.Package_food;
                var Package_time = that.data.gettime;
                var Note = that.data.Note;
                var buyphone = that.data.pnone;
                var id = that.data.orders[0]._id;
                var buyLen = Number(that.data.orders[0].buyLen);
                var Gopenid =  that.data.orders[0].Gopenid;
                console.log('-----------',id);
                wx.cloud.callFunction({
                  // 云函数名称
                  name: 'foodNum',
                  // 传给云函数的参数
                  data: {
                    id:id,
                    index:dataIndex,
                    Num:-buyLen
                  },
                  success: function (res) {
                    console.log('修改数据成功！！',res)
                   that.addFoodOrderInfo(orderCode,Package_Phone,Package_name,Package_no,buyopenid,imgArr,nickname,ptjobCampus,sellopenid,Package_food,Package_time,Note,buyphone,id,buyLen,Gopenid);
                    wx.reLaunch({
                      url: '/pages/my/myFood/myFood?goCurrtab='+Number(0) + '&id=' + id,
                    })
                  },
               
                })
                wx.cloud.callFunction({
                  name: "send",
                  data: {
                    openid:Gopenid,
                    type:orderCode,
                    name:nickname,
                    phone:buyphone,
                    phone1:buyphone,
                    address:ptjobCampus
                
                  }
                }).then(res => {
                 console.log("推送消息成功*************", res)
                }).catch(res => {
                 console.log("推送消息失败", res)
                })    
              }
            
              console.log('用户点击确定')

            });

       
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })


    
   
    }
  },
    // 支付成功添加到数据库
    addFoodOrderInfo(orderCode,Package_Phone,Package_name,Package_no,buyopenid,imgArr,nickname,ptjobCampus,sellopenid,Package_food,Package_time,Note,buyphone,id,buyLen,Gopenid)
    {
      var that=this
      console.log('Time',new Date().getTime())
      console.log('time',formatDate2(new Date().getTime()))
        db.collection('FoodOrderInfo').add({
          data: {
            orderCode:orderCode,
            Package_Phone:Package_Phone,
            Package_name:Package_name,
            Package_no:Package_no,
            buyopenid:buyopenid,
            imgArr:imgArr,
            nickName:nickname,
            ptjobCampus:ptjobCampus,
            sellopenid:sellopenid,
            Package_food:Package_food,
            Package_time:Package_time,
            Note:Note,
            buyphone:buyphone,
            id:id,
            status:"未接单",
            buyLen:buyLen,
            Gopenid:Gopenid,
            isstatus:false,
            Takefood:false,
            BuyTime:new Date().getTime(),
            BuyTimeStamp:formatDate2(new Date().getTime()),
            nowTime:formatDate3(new Date().getTime())
          },
          success: rest => {
            console.log("订餐成功后后添加数据库成功", rest)
      
          },
          fail: err => {
            console.log("购买成功后添加数据库失败", err)
          }
        })
      },
   // 支付订单号
   createOrderCode() {
    let orderCode = '';
    for (var i = 0; i < 6; i++) {
      orderCode += Math.floor(Math.random() * 10);
    }
    orderCode = new Date().getTime() + orderCode;
    this.setData({
      orderCode: orderCode
    });
  },
  // 生成二维码并且上传二维码到数据库
  // nickname:options.nickname,
  //       pnone:options.pnone,
  //       foodId:foodId,
  //       buyNum:options.buyNumber,
  //       breakfast:options.breakfast,
  //       lunch:options.lunch,
  //       dinner:options.dinner,
  //       datainfo:Number(options.info),
  //       Note:options.Note,
  //       Package_food1:options.Package_food,
  //       Package_time:options.Package_time,
  //       isstatus: options.isstatus 
  getmyQrcode(){
    var that=this;
    console.log('-----------orderCode',that.data.orderCode);

        qrcode({
          width: 125,
          height: 125,
          canvasId: 'myQrcode',
          text:that.data.orderid,
        })
        // setTimeout(that.canvasToTempFile,2000);
         that.canvasToTempFile();
         console.log("22", 22)
   
},
  canvasToTempFile(){
    var that=this;
    wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 450,
        height: 600,
        canvasId: 'myQrcode',
        success: function (res) {
            console.log('111',res.tempFilePath);
            const cloudPath = new Date().getTime()+'png'
            var imagePath = res.tempFilePath
            // console.log('***********************');
            //   wx.cloud.uploadFile({
            //     cloudPath:cloudPath,
            //     filePath: imagePath,
            //     sizeType : ['compressed']
            //   }).then(rest=>{
            
           
            //   })
        }
    })
    
},
//扫描信息
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
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
    //取餐时间
    // timer(complete){
    //   var that=this
    //   db.collection("categoryDetail").get({
    //     success(res) {
    //       console.log("数据库获取成功", res)
    //       that.setData({
         
    //         takeTime:res.data[5].Detail
    //       })
    //       console.log('99999999999999999',that.data.takeTime);
    //       if(complete){
    //         complete()
    //       }
    //     },
    //     fail(res) {
    //       console.log("数据库获取失败", res);
    //     }
    //   })
    // },
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
function formatDate3(time){
  var date = new Date(time);

  var year = date.getFullYear(),
      month = date.getMonth()+1,//月份是从0开始的
      day = date.getDate();
 
  var newTime = year + '-' +
      (month < 10? '0' + month : month) + '-' +
      (day < 10? '0' + day : day) ;
  

  return newTime;
};