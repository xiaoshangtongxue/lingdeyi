// pages/shoppingCart/shoppingCart.js
var app = getApp();
const db = wx.cloud.database()
const orginalPrice = 0; //由于0.00在赋值时是0，用toFixed()取余
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    // 书本
    _idGoods:'',
    cartsId: [],
    carts: [], // 购物车列表
    carts1: [], // 
    saleOut:[],
    myCartGoodsLength: 0,
   /*  hasList: true, // 列表是否有数据 */
    totalPrice: orginalPrice.toFixed(2), // 总价，初始为0
    selectAllStatus: false, // 全选状态，默认全选
    GoodsId: '',
    isMyCartShow: false,
    GoodsPrice: 0,
    showModal:false,
    nickname:'',
    pnone:'',
    GoodsCartId:[],
    GoodsCartStatus:[],
    GoodsCartStatusId:[],
    buyNumber: 1,
    buyNumMin: 1,
    buyNumMax: 100,
    lenlist:[1,2,3],
    info:0
  },
 
  stepChange(e) {
    let that = this;
    const index = e.currentTarget.dataset.index;    // 获取data- 传进来的index
    var list = that.data.carts[index];
    console.log("index****************",that.data._idGoods);
    that.data.carts[index].buyLen = e.detail;
    that.setData({
      buyNumMax:list.GoodsNum
    })
    console.log("carts****************",that.data.carts);
    db.collection('cart').doc(that.data._idGoods).update({
      data: {
        // 表示将 done 字段置为 true
        myCart: that.data.carts,
      },
      success: function (e) {       
          console.log('购物车更新成功');

       }})
    console.log(list);
    that.getTotalPrice();

  },
  stepper() {
    //什么也不做
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log('执行到了onLoad');
  
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //修改订单状态
  // modOrderStatus1(id,status,isStatus,modsuccess){
  //   wx.cloud.callFunction({
  //     // 云函数名称
  //     name: 'modOrderStatus',
  //     // 传给云函数的参数
  //     data: {
  //      id: id,
  //      status:status,
  //      isStatus:isStatus
  //     },
  //     success: function (res) {
  //       console.log('更新成功',res)
  //         modsuccess()
  //     },
  //     fail: function (err) {
  //       console.log(err)
  //     },
  //   })
  // },
  //修改订单状态
  // modOrderStatus(id,status,isStatus){
  //   wx.cloud.callFunction({
  //     // 云函数名称
  //     name: 'modOrderStatus',
  //     // 传给云函数的参数
  //     data: {
  //      id: id,
  //      status:status,
  //      isStatus:isStatus
  //     },
  //     success: function (res) {
  //       console.log('更新成功',res)

  //     },
  //     fail: function (err) {
  //       console.log(err)
  //     },
  //   })
  // },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      info:0
    })
    app.getopenid(res => {
      console.log("write cb res", res)
      that.setData({
        openid: res
      })
      that.register(()=>{
        that.Info(()=>{
          wx.showToast({
            title: '正在加载中...',
            icon: 'loading',
            duration:2000
          })
          that.setData({
            openid:'',
            _idGoods:'',
            cartsId: [],
            carts: [], // 购物车列表
            saleOut:[],
            myCartGoodsLength: 0,
            // totalPrice: orginalPrice.toFixed(2), // 总价，初始为0
            // selectAllStatus: false, // 全选状态，默认全选
            GoodsId: '',
            isMyCartShow: false,
            GoodsPrice: 0,
            nickname:'',
            pnone:'',
            showModal:false,
            GoodsCartId:[],
          GoodsCartStatus:[],
          GoodsCartStatusId:[],
          info:1
          })
          
          that.getGoodsCartList();
   

        })
      })
    })
    // app.getopenid(res => {
    //         console.log("write cb res", res)
    //         that.setData({
    //           openid: res
    //         })
    //       })
   
  
    
  //   console.log('执行到了onShow');
  //   var that = this;
  //   console.log('GoodsCartStatus999',that.data.GoodsCartStatus)
  //   console.log('GoodsCartStatus99999',that.data.GoodsCartStatusId)
  //  if(that.data.GoodsCartStatus.length!==0){
  //    for(var i=0;i<that.data.GoodsCartStatusId.length;i++){
  //     console.log('i',i)
  //     console.log('that.data.GoodsCartStatusId[i]',that.data.GoodsCartStatusId[i])
  //     var length=that.data.GoodsCartStatusId.length-1
  //     console.log('length',length)
  //     console.log('if',i==length)
  //     if(i==length){
  //        console.log('执行最后一次i',i)
  //        console.log('执行最后一次',that.data.GoodsCartStatusId[i])
  //       that.modOrderStatus1(that.data.GoodsCartStatusId[i],'未售',false,()=>{
  //         app.getopenid(res => {
  //           console.log("write cb res", res)
  //           that.setData({
  //             openid: res
  //           })
  //         })
  //         wx.showToast({
  //           title: '正在加载中...',
  //           icon: 'loading',
  //           duration:2000
  //         })
  //         that.getGoodsCartList()
  //         that.setData({
  //           openid:'',
  //           _idGoods:'',
  //           cartsId: [],
  //           carts: [], // 购物车列表
  //           saleOut:[],
  //           myCartGoodsLength: 0,
  //           totalPrice: orginalPrice.toFixed(2), // 总价，初始为0
  //           selectAllStatus: false, // 全选状态，默认全选
  //           GoodsId: '',
  //           isMyCartShow: false,
  //           GoodsPrice: 0,
  //           nickname:'',
  //           pnone:'',
  //           showModal:false,
  //           GoodsCartId:[],
  //         GoodsCartStatus:[],
  //         GoodsCartStatusId:[]
  //         })

  //       })
  //     }else{
  //       that.modOrderStatus(that.data.GoodsCartStatusId[i],'未售',false)
  //       console.log('未售',i)
  //     }
  //    }
  //  }else{
  //     app.getopenid(res => {
  //       console.log("write cb res", res)
  //       that.setData({
  //         openid: res
  //       })
  //     })
  //     wx.showToast({
  //       title: '正在加载中...',
  //       icon: 'loading',
  //       duration:2000
  //     })
  
  //     that.setData({
  //       openid:'',
  //       _idGoods:'',
  //       cartsId: [],
  //       carts: [], // 购物车列表
  //       saleOut:[],
  //       myCartGoodsLength: 0,
  //       // totalPrice: orginalPrice.toFixed(2), // 总价，初始为0
  //       // selectAllStatus: false, // 全选状态，默认全选
  //       GoodsId: '',
  //       isMyCartShow: false,
  //       GoodsPrice: 0,
  //       nickname:'',
  //       pnone:'',
  //       showModal:false,
  //       GoodsCartId:[],
  //     GoodsCartStatus:[],
  //     GoodsCartStatusId:[]
  //     })
  //     that.getGoodsCartList();
  //     // that.getTotalPrice();
  //     console.log('长度为0',333)
  //  }
 
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
    // 动态设置导航条标题
    wx.setNavigationBarTitle({
      title: '购物车'
    });
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标
    setTimeout(function(){
      wx.stopPullDownRefresh(); //停止加载
      wx.hideNavigationBarLoading(); //隐藏加载icon
    },2000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    
  },
//获取购物车物品数量
myGoodsCart(complete){
  var that=this
  console.log('1111',that.data.openid)
  db.collection('cart').where({
    _openid: that.data.openid
  }).get({
    success: function (res) {
        console.log('获取购物车数据',res)
        if(res.data.length==0){
          that.setData({
            myCartGoodsLength: 0,
            myCartGoodsLengthSale:0
          })
        }else{
          var arr = [];
          res.data[0].myCart.forEach(function(item){
            console.log('++++++++++++++++++',item);
            arr.push(item._id)
          })
          that.setData({
            myCartGoodsLength: res.data[0].myCart.length,
            cartsId: arr,
            _idGoods:res.data[0]._id
          })
          console.log('myCartGoodsLength',that.data.myCartGoodsLength)
          console.log('cartsId',that.data.cartsId)
        }
        if(complete){
          complete()
        }
    },
    fail: function (res) {
        console.log('获取失败', res)
    }
})
},

  // 获取购物车物品具体信息
getGoodsCartList(){
  var that = this;
  console.log('222222222222222222',that.data._idGoods);
   that.myGoodsCart(()=>{
    if(that.data.myCartGoodsLength==0){
      that.setData({
        isMyCartShow: true
      })
    }else{
  
   db.collection('cart').doc(that.data._idGoods).get({
                success: function (e) {  
                  e.data.myCart.forEach(function(item){
                    item.selected = false;
                  })
                  db.collection('cart').doc(that.data._idGoods).update({
                    data: {
                      myCart: e.data.myCart,
                    },
                    success: function (e) {       
                        console.log('购物车更新成功');
                     }})
                  that.setData({
                      carts:e.data.myCart,
                      selectAllStatus:false,
                      totalPrice: orginalPrice.toFixed(2), // 总价，初始为0
                   })
                  that.checkNum();
                  console.log('3333333333333333333',that.data.carts);
                  console.log('3333333333333333333',that.data._idGoods);
                  db.collection('cart').doc(that.data._idGoods).update({
                    data: {
                      myCart: that.data.carts,
                    },
                    success(e) {       
                        console.log('购物车更新成功',e.data);
                     }});                       
  }})
      // var myCartGoodsLength = that.data.myCartGoodsLength;
      // var cartsId = that.data.cartsId
      // console.log('myCartBookLength11111', myCartGoodsLength);
      // console.log('cartsId1', cartsId);
      
      // for(var i=0;i<myCartGoodsLength;i++){
      //   console.log('cartsId2', cartsId[i]);
      //   console.log('获取购物车cart数据ii',i) 
      //   db.collection('wxGoodsPost').doc(cartsId[i]).get({
      //     success: function (res) {
      //       if(res.data.GoodsNum !== 0){
      //             var cart=res.data
      //             cart['selected']=false, 
      //             cart['GoodsPrice']=cart.GoodsPrice.toFixed(2)
      //             console.log('获取购物车cart数据未售-----------******',cart)
      //              that.setData({
      //               carts1: that.data.carts1.concat(cart),
      //             })
              
       
      //       }else{
      //         var sale=res.data
      //         sale['selectedNo']=true,
      //         sale['GoodsPrice']=sale.GoodsPrice.toFixed(2)
      //         console.log('获取购物车cart数据已售',sale)
      //          that.setData({
      //           saleOut: that.data.saleOut.concat(sale),
      //         })
      //       }  
      //       // wx.hideLoading()
      //     },
      //     fail: function (res) {
      //         console.log('获取失败', res)
      //     }
      //  })
      // }
      // db.collection('cart').doc(that.data._idGoods).get({
      //           success: function (e) {   
              
      //            for(var j = 0; j < e.data.myCart.length; j++){
            
      //                   console.log(that.data.carts1[j]);
      //                   that.data.carts1[j].buyLen = e.data.myCart[j].buyLen;
      //                   that.setData({
      //                     carts:that.data.carts.concat(that.data.carts1[j]),
      //                   })

      //            }
      //           console.log('kkkkkkkkkkkkkkkkkkkkk',that.data.carts);
            
      //           }
      //         })
    }
}) 
  
},


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

   // 进详情页之前检测是否已售
isBuy(id,success){
  var that=this
  db.collection("wxGoodsPost").doc(id).get().then(res=>{
    console.log("请求成功8", res.data) 
    that.setData({
      satatus:res.data.status
    })
      success()
}).catch(res=>{
    console.log("请求失败", res)
})
},
  // 跳转详情物品
  goToDetail(e){
    var that=this
    console.log(e)
    var id=e.currentTarget.dataset.id
    console.log('id', id);
    that.isBuy(id,()=>{
        console.log('获取成功1119999999999999999999999',that.data)
        if(that.data.GoodsNum !== 0){
          wx.navigateTo({
            url: '/pages/classify/GoodsDetail/GoodsDetail?id=' + id, 
          })
        }else{
          wx.showToast({
            title: '此商品库存不足',
            icon: 'error',
            duration:2000
          });
          return
        }
    })
  },

      
  //计量总价物品
  getTotalPrice() {
    var that=this
    let carts = that.data.carts; // 获取购物车列表
    let total = 0.00;
    for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据
      if (carts[i].selected) { // 判断选中才会计算价格
        console.log('bookPrice', carts[i].GoodsPrice)
        total += Number(carts[i].GoodsPrice)*carts[i].buyLen; // 所有价格加起来
      }
    }
    that.setData({
      GoodsPrice: total,
      totalPrice:total.toFixed(2)
    })
    console.log('bookPrice1', that.data.GoodsPrice)
  },
   
  //选择事件物品
  selectList(e) {
    let that = this;
    const index = e.currentTarget.dataset.index;    // 获取data- 传进来的index
    console.log("index",index);
    // let selectAllStatus = that.data.selectAllStatus; //是否已经全选
    let str = true;  //用str与每一项进行状态判断
    let carts = that.data.carts;                    // 获取购物车列表
    const selected = carts[index].selected;         // 获取当前商品的选中状态
    carts[index].selected = !selected;              // 改变状态
    that.setData({
      carts: carts
    });
    console.log("carts",that.data.carts);
    that.getTotalPrice();                           // 重新获取总价
    for (var i = 0; i < carts.length; i++) {
      str = str && carts[i].selected;           //用str与每一项进行状态判断
    }
    if (str === true) {
      that.setData({
        selectAllStatus: true
      })
    } else {
      that.setData({
        selectAllStatus: false
      })
    }
    db.collection('cart').doc(that.data._idGoods).update({
      data: {
        // 表示将 done 字段置为 true
        myCart: that.data.carts,
      },
      success: function (e) {       
          console.log('购物车更新成功');

       }})
   
  
  },
  
  //全选事件物品
  selectAll(e) {
    console.log('执行了全选按钮')
    var that = this;
    let selectAllStatus = that.data.selectAllStatus;    // 是否全选状态
    let carts = that.data.carts;
    console.log('selectAllStatus',selectAllStatus)
    selectAllStatus = !selectAllStatus;
    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;            // 改变所有商品状态
    }
    that.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    that.getTotalPrice();                               // 重新获取总价
    if (carts.length === 0) { //当没有物品时，不能再点“全选”
      wx.showToast({
        title: '无未售商品',
        icon: 'none',
        duration: 2000
      })
    }
    db.collection('cart').doc(that.data._idGoods).update({
      data: {
        // 表示将 done 字段置为 true
        myCart: that.data.carts,
      },
      success: function (e) {       
          console.log('购物车更新成功');

       }})
  },
  //删除物品
  deleteList(e) {
    var that=this
    const index = e.currentTarget.dataset.index;
    var _idGoods=that.data._idGoods
    console.log('that.data._idGoods',that.data._idGoods)
    let carts = that.data.carts;
    wx.showModal({
      title: '提示',
      content: '将此产品移除购物车？',
      success: res=> {
        if (res.confirm) {
          console.log('用户点击确定')
          console.log('carts+',carts[index]._id)
          var Length = that.data.carts.length;
          that.remove(carts, index);   //调用方法传参
          that.updateCart('cart',_idGoods,carts);
    
          if(carts.length==0){
            that.removeCollect('cart',_idGoods)
          }
          // carts.splice(index, 1); //删除购物车列表里这个商品
          that.setData({
            carts: carts
          });
          console.log('carts-',that.data.carts) 
          if (carts.length == 0) {                  // 如果购物车为空
            that.setData({
              // hasList: false,             // 修改标识为false，显示购物车为空页面
              selectAllStatus: false,
              totalPrice: orginalPrice.toFixed(2),              //此时价格为0
              isMyCartShow:true,  
            });
          } else {         
            that.selectAll();                     // 如果不为空
            that.getTotalPrice();           // 重新计算总价格
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  
  //  //删除已售物品
  // deleteListSale(e) {
  //   var that=this
  //   const index = e.currentTarget.dataset.index;
  //   var _idGoods=that.data._idGoods
  //   console.log('that.data._idGoods',that.data._idGoods)
  //   let saleOut = that.data.saleOut;
  //   wx.showModal({
  //     title: '提示',
  //     content: '将此产品移除购物车？',
  //     success: res=> {
  //       if (res.confirm) {
  //         console.log('用户点击确定')
  //         var carts = that.data.carts
  //         var val = saleOut[index]._id;  //你要移除的元素标识，例如下标之类的
  //         console.log('-----------',index);
  //         // that.remove(carts, val);   //调用方法传参
       
  //         // that.updateCart('cart',_idGoods,carts)
  //         if(carts.length==0){
  //           that.removeCollect('cart',_idGoods)
  //         }
  //         saleOut.splice(index, 1); //删除购物车列表里这个商品
  //         that.setData({
  //           saleOut: saleOut
  //         });
  //         console.log('carts-',that.data.saleOut) 
  //         if (carts.length == 0) {                  // 如果购物车为空
  //           that.setData({
  //             // hasList: false,             // 修改标识为false，显示购物车为空页面
  //             selectAllStatus: false,
  //             totalPrice: orginalPrice.toFixed(2),              //此时价格为0
  //             isMyCartShow:true,  
  //           });
  //         } else {                              // 如果不为空
  //           this.getTotalPrice();           // 重新计算总价格
  //         }
  //       } else if (res.cancel) {
  //         console.log('用户点击取消')
  //       }
  //     }
  //   })
  // },
 
 // 删除方法
  remove: function(array, index) {
    // for (var i = 0; i < array.length; i++) {
    //   if (array[i] == val) {
    //     array.splice(i, 1);
    //   }
    // }
    array.splice(index,1)
    console.log('---------------------',array);
    return -1;
  },
  // 更新购物车数据
  updateCart(name,_idGoods,carts){
    db.collection(name).doc(_idGoods).update({
      data: {
        myCart: carts, 
      },
      success: res => {
        console.log("修改数据库成功", res)
      },
      fail: err => {
        console.log("添加数据库失败", err)
      }

    })
  },
// 如果购物车id下的数据为0时删除数据库数据
 removeCollect(name,id){
  db.collection(name).doc(id).remove()
},


  //检测库存数量
  async checkNum(){
    var that = this;
    var carts = that.data.carts;
    for(var i = 0; i < carts.length ;i++){
 
        let res = await db.collection('wxGoodsPost').doc(carts[i]._id).get();
        console.log('************',res);
        carts[i].GoodsNum = res.data.GoodsNum;
    }
    that.setData({
      carts:carts,
    })


 },

toBuy(){
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
          if(that.data.totalPrice==0){
            wx.showToast({
              title: '您未添加任何商品',
              icon: 'none',
              duration: 2000
            })
          }else{
            var GoodsCartId=[]
             var carts=that.data.carts;
            carts.forEach(item=>{
              if (item.selected){
                GoodsCartId.push(item._id);
              }
            })
            that.setData({
              GoodsCartId:GoodsCartId
            },
            ()=>{
              that.GoodsCartStatus(()=>{
            
                if(that.data.GoodsCartId.length==that.data.GoodsCartStatus.length){
             
                      console.log('GoodsCart',GoodsCartId)
                      var GoodsCartArrId = JSON.stringify(GoodsCartId)
                        for(var i=0;i<GoodsCartId.length;i++){
                         console.log('GoodsCartId[i]',GoodsCartId[i])
                        //  that.modOrderStatus(GoodsCartId[i],'已售',true)
                         console.log('888',888)
                        }
                    wx.navigateTo({
                      url: '../settlement/settlement?GoodsCartId='+GoodsCartArrId +'&nickname=' + that.data.nickname+'&pnone=' + that.data.pnone+'&Number='+ '1'+ '&type=' + '1',
                      })
                // }
                }else{
                  console.log('555')
                }
              })
            }
            )
            
           
          
          }
        })
      })
      console.log("openid1",res)
    })  

  },
  Info(complete){
    var that=this
      db.collection('wxmember').where({
         _openid: that.data.openid
      }).get().then(res => {
        console.log("会员信息111",res.data.length);
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
                  url: '/pages/login/startin',
                })
              }else if(rest.cancel){
                wx.switchTab({
                  url: '/pages/my/my',
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
  GoodsCartStatus(complete){
  var that=this
  console.log("GoodsCartI000d",that.data.GoodsCartId);
  for(var i = 0; i < that.data.GoodsCartId.length; i++){
    db.collection("wxGoodsPost").doc(that.data.GoodsCartId[i]).get({
      success(res){ 
       console.log("数据获取成功啦",res.data.status);
       that.setData({
        GoodsCartStatus:that.data.GoodsCartStatus.concat(res.data.status),
        GoodsCartStatusId:that.data.GoodsCartStatusId.concat(res.data._id)
       })
       if(complete){
        complete()
      }
       console.log("GoodsCartStatus1111111111",that.data.GoodsCartStatus);
       console.log("GoodsCartStatusId111111111111",that.data.GoodsCartStatusId);
      
      },
      fail(err){
        wx.showToast({
          title: '该商品已下架',
          icon: 'error',
          duration: 2000
        })
        that.setData({
          GoodsCartStatus:[],
          GoodsCartStatusId:[]
         })
        console.log("数据获取失败", err);
   
      }
    })  
   
  
}

},

})