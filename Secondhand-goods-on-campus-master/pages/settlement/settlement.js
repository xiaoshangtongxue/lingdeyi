// pages/settlement/settlement.js
const db = wx.cloud.database()
const App = getApp()

// import Dialog from '/../../miniprogram_npm/vant/weapp/dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    nickname:'',
    pnone:'',
    address:'',
    GoodsCartArrId:[],
    orders:[],
    length:0,
    totalPrice:0,
    orderCode:'',
    _id:'',
    cartsId:[],
    Number:'0',
    item:'微信支付',
    orderNo:'',
    BuyTime:'',
    BuyTimeStamp:'',
    integral:1,
    buyNum:1,
    listNum:[],
    type:0,
    carts:[],
    newOrders:[]
  },
 
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
     var GoodsCartArrId=JSON.parse(options.GoodsCartId)
      console.log('GoodsCartArrId', GoodsCartArrId);
    var length=GoodsCartArrId.length
      that.setData({
        nickname:options.nickname,
        pnone:options.pnone,
        Number:options.Number,
        GoodsCartArrId:GoodsCartArrId,
        length:length,
        type:Number(options.type)
      },()=>{
        if(that.data.type == 0){
          that.getGoodsCartList1()
        }else{
          that.getGoodsCartList()
        }
 
      })
      console.log('Number',that.data.Number);
      var len = wx.getStorageSync('goodslen');
      that.setData({
        buyNum:len,
      })

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
  _handleInputAddress:function (e){
    console.log("地址", e)
    this.setData({
      address: e.detail.value
    })
  },
  // 获取购物车物品详情
  getGoodsCartList(){
    console.log(1);
    var that = this;
    db.collection('cart').where({
      _openid:that.data.openid
    }).get({
    success: function (res) { 
        console.log('*************',res.data[0].myCart);
        that.setData({
          carts:res.data[0].myCart
        })
        res.data[0].myCart.forEach(item => {

                 if(item.selected == true){
                  that.setData({
                    orders: that.data.orders.concat(item),
                    totalPrice:that.data.totalPrice + (Number(item.GoodsPrice) * Number(item.buyLen))
                  })
            
                 }
              
        })
        that.setData({
          totalPrice:that.data.totalPrice.toFixed(2)
        })
    }})
    // for(var i=0;i<that.data.GoodsCartArrId.length;i++){
    //   console.log('GoodsCartArrId', that.data.GoodsCartArrId[i]);
    //   db.collection('wxGoodsPost').doc(that.data.GoodsCartArrId[i]).get({
    //     success: function (res) {
    //         var orders=res.data
    //         orders.GoodsPrice=orders.GoodsPrice.toFixed(2)
    //         console.log('orders',orders)
    //          that.setData({
    //           orders: that.data.orders.concat(orders),
    //           totalPrice:((Number(that.data.totalPrice)+Number(res.data.GoodsPrice)).toFixed(2)*that.data.buyNum).toFixed(2)
    //         })
    //         console.log('orders', that.data.orders);
    //         console.log('totalPrice',that.data.totalPrice)
    //     },
    //     fail: function (res) {
    //         console.log('获取失败', res)
    //     }
    //  })
    // }
    console.log('orders1', that.data.orders);
  },
// 获取物品详情
  getGoodsCartList1(){
      console.log(1);
      var that = this;
      for(var i=0;i<that.data.GoodsCartArrId.length;i++){
        console.log('GoodsCartArrId', that.data.GoodsCartArrId[i]);
        db.collection('wxGoodsPost').doc(that.data.GoodsCartArrId[i]).get({
          success: function (res) {
              var orders=res.data
              orders.GoodsPrice=orders.GoodsPrice.toFixed(2)
          
              orders.buyLen =that.data.buyNum;
               that.setData({
                orders: that.data.orders.concat(orders),
                totalPrice:(that.data.totalPrice+orders.GoodsPrice*orders.buyLen).toFixed(2)
                // totalPrice:(Number(orders.buyLen) * Number(orders.GoodsPrice)).toFixed(2)
              })
                 console.log('orders++++++++++++++++++++++',orders)
              console.log('totalPrice',that.data.totalPrice)
          },
          fail: function (res) {
              console.log('获取失败', res)
          }
       })
      }
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


   // 提交订单
   tosubmit(){
    var that=this; 
    console.log('that.data.nickname', that.data.nickname);
    console.log('that.data.pnone',that.data.pnone);
    console.log('that.data.address',that.data.address);

    that.checkNum();
    for(var i = 0; i < that.data.orders.length;i++){
      console.log(that.data.orders[i].GoodsNum);
      if(that.data.orders[i].GoodsNum == 0 || that.data.orders[i].GoodsNum < that.data.orders[i].buyLen){
        var k = i + 1; 
        // Dialog.alert({
        //   title: '库存不足',
        //   message: '商品'+ k +'库存不足',
        //   theme: 'round-button',
        // }).then(() => {
       
        // });
        wx.showToast({
          title: '商品'+ k +'库存不足',
          icon: 'error',
          duration: 1500
        })
        return
      }

    }
    // var value = that.data.listNum.forEach(function(item){
    // })
    if(that.data.nickname == ''||that.data.pnone == ''||that.data.address == ''){
      wx.showToast({
        title: '您还有信息未填',
        icon: 'none',
        duration: 1500
      })
      return;
    }else{
      wx.requestSubscribeMessage({
        tmplIds: ['OgmNzl3p7y3sWo7_9ONL_pXSNG6ZoVhRmKaUTskSwcs','SldzZqnw3SHSEM3zADp0h_Fc6SO09qFFGaCSqJ15_Ms'], 
        success(res) {
          that.createOrderCode();
          console.log("nickname",that.data.nickname);
          console.log("pnone",that.data.pnone);
          console.log("that.data.orderCode",that.data.orderCode);
          console.log("that.data.totalPrice",that.data.totalPrice);    
    //提交订单验证商品数量
    wx.showToast({
      title: '正在加载中...',
      icon: 'loading',
      duration:2000
    });
    wx.cloud.callFunction({
      name: 'payment',
      data: {
        orderCode: that.data.orderCode,
        price: that.data.totalPrice,
        desc: '姓名：' + that.data.nickname + ' 联系方式：' + that.data.pnone + ' 价格：' + that.data.totalPrice + '(共'+that.data.length+'件)'+' 支付单号：' + that.data.orderCode,
      },
      success: res => {
        console.log("获取支付参数成功", res);
        const payment = res.result.payment
          //  调起支付
            wx.requestPayment({
                ...payment,
            success(res) {
              console.log('支付成功', res) 
              wx.showToast({
                title: '正在加载中...',
                icon: 'loading',
                duration:5000
              });
                // that.modOrderStatus(that.data.orders[i]._id,'未售',false
                 if(that.data.type==1){
                  for(var i =0 ;i<that.data.orders.length;i++){
                    console.log('3333333333333333333333333333333',that.data.orders[i]._id,that.data.orders[i].buyLen);
                    console.log('更数据成功----------------------',that.data.orders[i]._id,that.data.orders[i].buyLen)
                    that.modOrderStatus(that.data.orders[i]._id,'已售',true,-that.data.orders[i].buyLen)
                  }
                  that.myGoodsCart(()=>{
                    // 支付成功后更新到数据库信息
                    for(var i=0;i<that.data.orders.length;i++){
                      that.orderNo(()=>{
                        var  BuyTime=formatDate2(new Date().getTime());
                        var  BuyTimeStamp=new Date().getTime();
                        console.log('id',that.data.orders[i]._id)
                        that.setData({
                          BuyTime:BuyTime,
                          BuyTimeStamp:BuyTimeStamp,
                        })
                          var length=that.data.orders.length-1
                          var Id=that.data.orders[i]._id
                          console.log('是否是最后一次',i==length)
                          if(i==length){
                            console.log('id11',Id)
                           that.modorderNo1(Id,that.data.orderCode,that.data.address,that.data.nickname,that.data.pnone,that.data.orderNo,that.data.BuyTime,that.data.BuyTimeStamp,()=>{
                            // 支付成功后删除购物车数据库信息
                            var carts = that.data.carts;
                            var cartsModor = []
                            carts.forEach(item => {
                                 if(item.selected == false){
                                    cartsModor.push(item)
                                 }
                            })
  
            
                          console.log("************66666666666",cartsModor) 
                          console.log('that.data._id777777777777777',that.data._id) 
                          that.updateCart(that.data._id,cartsModor)
                        })
                          }else{
                            that.modorderNo(Id,that.data.orderCode,that.data.address,that.data.nickname,that.data.pnone,that.data.orderNo,that.data.BuyTime,that.data.BuyTimeStamp)
                          }
                      })
                     }
  
                  }) 
                }else{
                  for(var i =0 ;i<that.data.orders.length;i++){
                    console.log('3333333333333333333333333333333',that.data.orders[i]._id,that.data.orders[i].buyLen);
                    console.log('更数据成功----------------------',that.data.orders[i]._id,that.data.orders[i].buyLen)
                    that.modOrderStatus(that.data.orders[i]._id,'已售',true,-that.data.orders[i].buyLen)
                  
                  that.orderNo(()=>{
                    var  BuyTime=formatDate2(new Date().getTime());
                    var BuyTimeStamp=new Date().getTime();
                    that.setData({
                      BuyTime:BuyTime,
                      BuyTimeStamp:BuyTimeStamp
                    })
                    that.modorderNo1(that.data.orders[i]._id,that.data.orderCode,that.data.address,that.data.nickname,that.data.pnone,that.data.orderNo,that.data.BuyTime,that.data.BuyTimeStamp,()=>{
                      wx.reLaunch({
                        url: '/pages/my/myorder/myorder?goCurrtab='+Number(0),
                      })
                    })
                  })
                 
                }

              }
            
               
            },
          fail(err) {
              console.error('支付失败', err);
              wx.showToast({
                title: '正在加载中...',
                icon: 'loading',
                duration:2000
              });
              for(var i=0;i<that.data.orders.length;i++){
                // that.modOrderStatus(that.data.orders[i]._id,'已售',true,-that.data.orders[i].buyLen)
                that.modOrderStatus(that.data.orders[i]._id,'未售',false,0)
                console.log('7777',7777)
               }
               console.log('Number1111',that.data.Number==1)
               if(that.data.type==1){
                console.log('购物车')
                wx.switchTab({
                  url: '/pages/shoppingCart/shoppingCart',
                })   
               }else{
                   console.log('物品详情页')
                   wx.redirectTo({
                    url: '/pages/classify/GoodsDetail/GoodsDetail?id=' + that.data.orders[0]._id
                  })
               } 
               
          }
    })        

   
      },
      fail: res => {
         console.log("获取支付参数失败", res);
      },
    });
      
        },
        fail(res) {
          that.createOrderCode();
          console.log("nickname",that.data.nickname);
          console.log("pnone",that.data.pnone);
          console.log("that.data.orderCode",that.data.orderCode);
          console.log("that.data.totalPrice",that.data.totalPrice);
          wx.showToast({
            title: '正在加载中...',
            icon: 'loading',
            duration:2000
          });
          wx.cloud.callFunction({
            name: 'payment',
            data: {
              orderCode: that.data.orderCode,
              price: that.data.totalPrice,
              desc: '姓名：' + that.data.nickname + ' 联系方式：' + that.data.pnone + ' 价格：' + that.data.totalPrice + '(共'+that.data.length+'件)'+' 支付单号：' + that.data.orderCode,
            },
            success: res => {
               console.log("获取支付参数成功", res);
              const payment = res.result.payment
                //  调起支付
                  wx.requestPayment({
                      ...payment,
                  success(res) {
                    // that.modOrderStatus(that.data.orders[i]._id,'已售',true,-that.data.orders[i].buyLen)
                    console.log('支付成功', res) 
                    wx.showToast({
                      title: '正在加载中...',
                      icon: 'loading',
                      duration:5000
                    });
                     if(that.data.type==1){
                      that.myGoodsCart(()=>{
                        // 支付成功后更新到数据库信息
      // 支付成功后更新到数据库信息
      for(var i =0 ;i<that.data.orders.length;i++){
        console.log('3333333333333333333333333333333',that.data.orders[i]._id,that.data.orders[i].buyLen);
        console.log('更数据成功----------------------',that.data.orders[i]._id,that.data.orders[i].buyLen)
        that.modOrderStatus(that.data.orders[i]._id,'已售',true,-that.data.orders[i].buyLen)
      }
      for(var i=0;i<that.data.orders.length;i++){
        that.orderNo(()=>{
          var  BuyTime=formatDate2(new Date().getTime());
          var  BuyTimeStamp=new Date().getTime();
          console.log('id',that.data.orders[i]._id)
          that.setData({
            BuyTime:BuyTime,
            BuyTimeStamp:BuyTimeStamp,
          })
            var length=that.data.orders.length-1
            var Id=that.data.orders[i]._id
            console.log('是否是最后一次',i==length)
            if(i==length){
              console.log('id11',Id)
             that.modorderNo1(Id,that.data.orderCode,that.data.address,that.data.nickname,that.data.pnone,that.data.orderNo,that.data.BuyTime,that.data.BuyTimeStamp,()=>{
              // 支付成功后删除购物车数据库信息
              var carts = that.data.carts;
              var cartsModor = []
              carts.forEach(item => {
                   if(item.selected == false){
                      cartsModor.push(item)
                   }
              })


            console.log("************66666666666",cartsModor) 
            console.log('that.data._id777777777777777',that.data._id) 
            that.updateCart(that.data._id,cartsModor)
          })
            }else{
              that.modorderNo(Id,that.data.orderCode,that.data.address,that.data.nickname,that.data.pnone,that.data.orderNo,that.data.BuyTime,that.data.BuyTimeStamp)
            }
        })
       }
                      }) 
                    }else{
                      for(var i =0 ;i<that.data.orders.length;i++){
                        console.log('3333333333333333333333333333333',that.data.orders[i]._id,that.data.orders[i].buyLen);
                        console.log('更数据成功----------------------',that.data.orders[i]._id,that.data.orders[i].buyLen)
                        that.modOrderStatus(that.data.orders[i]._id,'已售',true,-that.data.orders[i].buyLen)
                      
                      that.orderNo(()=>{
                        var  BuyTime=formatDate2(new Date().getTime());
                        var BuyTimeStamp=new Date().getTime();
                        that.setData({
                          BuyTime:BuyTime,
                          BuyTimeStamp:BuyTimeStamp
                        })
                        that.modorderNo1(that.data.orders[0]._id,that.data.orderCode,that.data.address,that.data.nickname,that.data.pnone,that.data.orderNo,that.data.BuyTime,that.data.BuyTimeStamp,()=>{
                          wx.reLaunch({
                            url: '/pages/my/myorder/myorder?goCurrtab='+Number(0),
                          })
                        })
                      })
                     
                    }
                  }
                  },
                fail(err) {
                    console.error('支付失败', err);
                    wx.showToast({
                      title: '正在加载中...',
                      icon: 'loading',
                      duration:2000
                    });
                    for(var i=0;i<that.data.orders.length;i++){
                      console.log('that.data.GoodsCartArrIdd[i]',that.data.GoodsCartArrId[i])
                      that.modOrderStatus(that.data.orders[i]._id,'未售',false,0)
                      console.log('7777',7777)
                     }
                     console.log('Number1111',that.data.Number==1)
                     if(that.data.type==1){
                      console.log('购物车')
                      wx.switchTab({
                        url: '/pages/shoppingCart/shoppingCart',
                      })   
                     }else{
                         console.log('物品详情页')
                         wx.redirectTo({
                          url: '/pages/classify/GoodsDetail/GoodsDetail?id=' + that.data.orders[0]._id
                        })
                     } 
                     
                }
          })        
            },
            fail: res => {
               console.log("获取支付参数失败", res);
            },
          });
        }


      })

    } 
   
  
  },
  //检测库存数量
  async checkNum(){
     var that = this;
     var orders = that.data.orders;
     for(var i = 0; i < orders.length ;i++){
      let res = await db.collection('wxGoodsPost').doc(orders[i]._id).get(
       )
       orders[i].GoodsNum = res.data.GoodsNum;
     }
     that.setData({
       orders:orders,
     })


  },
  // getNum(id){
  //   var that = this;
  //   wx.cloud.callFunction({
  //     // 云函数名称
  //     name: 'SearchGoodsNum',
  //     // 传给云函数的参数
  //     data: {
  //      id: id,
  //     },
  //     success: function (res) {
  //       console.log('获取成功',res)
  //       that.setData({
  //         GoodsNum:res.result.data.GoodsNum,
  //       })
  //       console.log(that.data.GoodsNum);
  //     },
  //     fail: function (err) {
  //       console.log(err)
  //     },
  //   })

 
  // },
    /*下单成功后给买家发送模板消息 , customNum, date*/
    SoldOut(orderFormId,openid,GoodsName,nickName,GoodsWay,address,remark) {
      var that = this
      console.log("获取openid成功", openid)
      console.log("GoodsName", GoodsName)
      console.log("nickName", nickName)
      console.log("GoodsWay", GoodsWay)
      console.log("remark", remark)
      wx.cloud.callFunction({
        name: "SoldOut",
        data: {
          orderFormId:orderFormId,
          openid: openid,
          GoodsName: GoodsName,
          nickName: nickName,
          GoodsWay: GoodsWay,
          address: address,
          remark: remark,
        }
      }).then(res => {
       console.log("推送消息成功", res)
      }).catch(res => {
       console.log("推送消息失败", res)
      })
  
    },
     /*下单成功后给卖家发送模板消息 , customNum, date*/
     alreadyBuy(openid,GoodsName,nickName,GoodsWay,address,remark) {
      var that = this
      console.log("获取openid成功", openid)
      wx.cloud.callFunction({
        name: "alreadyBuy",
        data: {
          openid: openid,
          GoodsName:GoodsName,
          nickName:nickName,
          GoodsWay:GoodsWay,
          address:address,
          remark: remark,
        }
      }).then(res => {
       console.log("推送消息成功", res)
      }).catch(res => {
       console.log("推送消息失败", res)
      })
  
    },
  // 支付成功添加到数据库
  addGoodsOrderInfo(GoodsName,GoodsType,GoodsConditions,GoodsCampus,GoodsPrice,GoodsWay,GoodsRemark,imgArr,videoArr,id,nickName,phoneNumber,postNickName,postTime,orderCode,address,orderNo,BuyTime,BuyTimeStamp,postOpenid){
    var that=this
    console.log('Time',new Date().getTime())
    console.log('time',formatDate2(new Date().getTime()))
      db.collection('GoodsOrderInfo').add({
        data: {
          GoodsName:GoodsName,
          GoodsType:GoodsType,
          GoodsConditions:GoodsConditions,
          GoodsCampus:GoodsCampus,
          GoodsPrice:GoodsPrice,
          GoodsWay:GoodsWay,
          GoodsRemark:GoodsRemark,
          imgArr:imgArr,
          videoArr:videoArr,
          id:id,
          nickName:nickName,
          phoneNumber:phoneNumber,
          postNickName:postNickName,
          postTime:postTime,
          orderCode:orderCode,
          address:address,
          orderNo:orderNo,
          GoodsStatus:'待收货',
          BuyTime:BuyTime,
          BuyTimeStamp:BuyTimeStamp,
          postOpenid:postOpenid,
          orderStatus:'已支付'
        },
        success: rest => {
          console.log("购买成功后添加数据库成功", rest)
          db.collection('GoodsOrderInfo').where({
            id:id
          }).get({
            success: function (res) {
              console.log('获取数据成功123',res.data[0]) 
              console.log('that.data.orderCode',res.data[0].nickName) 
              console.log('that.data.address',res.data[0].address) 
              console.log('that.data.orderNo',res.data[0].GoodsWay) 
              console.log('that.data.orderNo',res.data[0].GoodsName) 
               //  买家支付成功后给卖家发消息
               that.SoldOut(res.data[0]._id,res.data[0]._openid,res.data[0].GoodsName,res.data[0].nickName,res.data[0].phoneNumber,res.data[0].address,'购买成功，若买家未联系您，请主动联系买家')
               that.alreadyBuy(res.data[0].postOpenid,res.data[0].GoodsName,res.data[0].nickName,res.data[0].phoneNumber,res.data[0].address,'联系买家将物品送达，提醒买家修改收货状态')
            },
            fail: function (res) {
                console.log('获取失败', res)
            }
         })
        },
        fail: err => {
          console.log("购买成功后添加数据库失败", err)
        }
      })
    },
//更新卖家数据库 订单编号 支付编号 未送达
modorderNo(id,orderCode,address,Buynickname,Buypnone,orderNo,BuyTime,BuyTimeStamp){
  var that=this
    wx.cloud.callFunction({
            // 云函数名称
      name: 'modorderNo',
            // 传给云函数的参数
      data: {
        id: id,
        orderCode:orderCode,
        address:address,
        Buynickname:Buynickname,
        Buypnone:Buypnone,
        orderNo:orderNo,
        BuyTime:BuyTime,
        BuyTimeStamp:BuyTimeStamp,
        GoodsStatus:'未送达',
        account:false
      },
      success: function (res) {
      console.log('更新成功',res)
      db.collection('wxGoodsPost').doc(id).get({
        success: function (res) {
          var orders = that.data.orders;
          orders.forEach(item => {
             if(item._id == id){
              console.log('支付成功后获取数据成功',res.data) 
              var GoodsPrice =res.data.GoodsPrice.toFixed(2)*item.buyLen;
              console.log('that.data.orderCode',res.data.orderCode) 
              console.log('that.data.address',res.data.address) 
              console.log('that.data.orderNo',res.data.orderNo) 
              console.log('that.data.BuyTime',res.data.BuyTime) 
              console.log('that.data.BuyTimeStamp',res.data.BuyTimeStamp) 
              that.addGoodsOrderInfo(res.data.GoodsName,res.data.GoodsType,res.data.GoodsConditions,res.data.GoodsCampus,GoodsPrice,res.data.GoodsWay,res.data.GoodsRemark,res.data.imgArr,res.data.videoArr,res.data._id,res.data.Buynickname,res.data.Buypnone,res.data.nickName,res.data.time,res.data.orderCode,res.data.address,res.data.orderNo,res.data.BuyTime,res.data.BuyTimeStamp,res.data._openid)
    
             }
          })
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
  },
  //更新卖家最后一条数据数据库 订单编号 支付编号 未送达
modorderNo1(id,orderCode,address,Buynickname,Buypnone,orderNo,BuyTime,BuyTimeStamp,modorderNoSuccess){
  var that=this
  wx.cloud.callFunction({
      // 云函数名称
    name: 'modorderNo',
      // 传给云函数的参数
    data: {
      id: id,
      orderCode:orderCode,
      address:address,
      Buynickname:Buynickname,
      Buypnone:Buypnone,
      orderNo:orderNo,
      BuyTime:BuyTime,
      BuyTimeStamp:BuyTimeStamp,
      GoodsStatus:'未送达',
      account:false
    },
    success: function (res) {
    console.log('更新成功',res)
    db.collection('wxGoodsPost').doc(id).get({
      success: function (res) {
        var orders = that.data.orders;
        orders.forEach(item => {
           if(item._id == id){
            console.log('支付成功后获取数据成功',res.data) 
            var GoodsPrice =res.data.GoodsPrice.toFixed(2)*item.buyLen;
            console.log('that.data.orderCode',res.data.orderCode) 
            console.log('that.data.address',res.data.address) 
            console.log('that.data.orderNo',res.data.orderNo) 
            console.log('that.data.BuyTime',res.data.BuyTime) 
            console.log('that.data.BuyTimeStamp',res.data.BuyTimeStamp) 
            that.addGoodsOrderInfo(res.data.GoodsName,res.data.GoodsType,res.data.GoodsConditions,res.data.GoodsCampus,GoodsPrice,res.data.GoodsWay,res.data.GoodsRemark,res.data.imgArr,res.data.videoArr,res.data._id,res.data.Buynickname,res.data.Buypnone,res.data.nickName,res.data.time,res.data.orderCode,res.data.address,res.data.orderNo,res.data.BuyTime,res.data.BuyTimeStamp,res.data._openid)
  
           }
        })
        modorderNoSuccess()
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
},
  //修改订单状态
 modOrderStatus(id,status,isStatus,Num){
    wx.cloud.callFunction({
      // 云函数名称
      name: 'modOrderStatus',
      // 传给云函数的参数
      data: {
       id:id,
       status:status,
       isStatus:isStatus,
       Num:Num
      },
      success: function (res) {
        console.log('更新成功************',res)

      },
      fail: function (err) {
        console.log(err)
      },
    })
  },
  //获取购物车物品数量
myGoodsCart(complete){
  var that=this
  db.collection('cart').where({
    _openid: that.data.openid
  }).get({
    success: function (res) {
        console.log('获取购物车数据',res)
          that.setData({
            _id: res.data[0]._id,
            cartsId: res.data[0].myCart,
          })
          console.log('cartsId',that.data.cartsId)
        
        if(complete){
          complete()
        }
    },
    fail: function (res) {
        console.log('获取失败', res)
    }
})
},
// 支付成功后更新购物车物品数量
updateCart(_id,addTableData){
  var that = this;
  db.collection('cart').doc(_id).update({
   data:{
    myCart:addTableData
   }
  }).then(res => {
    console.log('修改更新库存成功', res)
    that.myGoodsCart(()=>{
      if(that.data.cartsId.length==0){
        that.removeCollect(_id)
        wx.reLaunch({
          url: '/pages/my/myorder/myorder?goCurrtab=' + Number(0),
        })
      }else{
        wx.reLaunch({
          url: '/pages/my/myorder/myorder?goCurrtab=' + Number(0),
        })
      }
    })
  }).catch(err=>{
    console.log('修改更新库存失败',err)
  })
},
// 如果购物车id下的数据为0时删除数据库数据
removeCollect(id){
  db.collection('cart').doc(id).remove()
  console.log('删除成功')
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
  
  }
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