// pages/movie-detail/movie-detail.js
var app = getApp();
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postId:'',
    mycart:[],
    doc:'',
    openid:'',
   /*  indicatorDots: true,  //是否显示面板指示点
    autoplay: true,      //是否自动切换
    interval: 3000,       //自动切换时间间隔
    duration: 1000,       //滑动动画时长 */
    utoplay:true,
    indicatorDots:false,
    interval:4000,
    duration:500,
    circular:true,
    swiperIndex:1,
    videoShow:false,
    imgArrShow:true,
    selectSizePrice: 0,
    selectSizeOPrice: 0,
    buyNumber: 1,
    buyNumMin: 1,
    buyNumMax: 100,
    detailData: {},
    nickName: '',
    show: false,
    flag:1,
  },
  swiperChange(e){
    this.setData({
      swiperIndex:e.detail.current +1
    })
  },
  // 播放视频
  videoShow(){
    this.setData({
      videoShow:true,
      imgArrShow:false
    })
  },
  quit(){
    this.setData({
      videoShow:false,
      imgArrShow:true
    })
  },
  // 图片预览
  handlePrevewImage(e){
  const urls=this.data.detailData.imgArr
  const current=e.currentTarget.dataset.url
  wx.previewImage({
    urls,
    current
  })
  },
  // 添加数量
  tobuy: function () {

    var that = this;

          this.setData({
            show: true,
            flag:1
          })
      
 

  },
   // 添加购物车数量
   tobuy1: function () {
    var that = this;

          this.setData({
            show: true,
            flag:0
          })

   
 

  },
  onClose() {
    this.setData({ show: false });
  },
  stepChange(event) {
    this.setData({
      buyNumber: event.detail
    })
    wx.setStorageSync('goodslen', this.data.buyNumber);
  },
  // 加购物车之前获取原来购物车数据
  myCartArr(openid){
    var that=this
    db.collection("cart").where({
      _openid: openid,
    }).get()
      .then(res => {
         console.log("获取购物车数据成功",res.data[0].myCart)
         console.log("获取购物车数据成功",res.data.length)
         console.log('--------------------',res.data[0].myCart);
         if(res.data.length==0 || res.data[0].myCart.length==0){
          that.setData({
            mycart:[]
           })
         }
         else{
          that.setData({
            mycart:res.data[0].myCart
           })
         }
      })
      .catch(err => {
         console.log("获取购物车数据失败",err);
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    console.log("id",options.id); //接收上一个页面传过来的数据，是个对象。
    that.setData({
      postId: options.id
    },()=>{
      console.log('that.data.postId',that.data.postId)
      // that.modOrderStatus(that.data.postId,'未售',false,0)
      that.getGoodsDetail(that.data.postId)
    })
    app.getopenid(res => {
      console.log("write cb res", res)
      that.setData({
        openid: res
      })
      that.myCartArr(res)
    })
    wx.setStorageSync('goodslen', this.data.buyNumber);
  },
   //修改订单状态
   modOrderStatus(id,status,isStatus,Num){
    console.log('id',id)
    console.log('status',status)
     console.log('isStatus',isStatus)
    wx.cloud.callFunction({
      // 云函数名称
      name: 'modOrderStatus',
      // 传给云函数的参数
      data: {
       id: id,
       status:status,
       isStatus:isStatus,
       Num:Num
      },
      success: function (res) {
        console.log('更新成功了',res)

      },
      fail: function (err) {
        console.log(err)
      },
    })
  },
  // 获取数据库数据
 getGoodsDetail(id){
  let that = this;
  db.collection("wxGoodsPost").doc(id).get({
    success(res){ 
     console.log("数据获取成功啦",res);
      that.setData({
        detailData: res.data,
        buyNumMax:res.data.GoodsNum
      })
      console.log("detailData",that.data.detailData);
    },
    fail(err){
      console.log("数据获取失败", err);
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
    var  that=this
    console.log('that.data.postId',that.data.postId)
    // that.modOrderStatus(that.data.postId,'未售',false,0)
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
    wx.setNavigationBarTitle({
      title: '物品详情'
    });

    wx.showNavigationBarLoading(); //在标题栏中显示加载图标
    setTimeout(function () {
      wx.stopPullDownRefresh(); //停止加载
      wx.hideNavigationBarLoading(); //隐藏加载icon
    }, 2000)
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
  // 加入购物车按钮
  addMyCart(){
    var that = this;
    var postId = that.data.postId;
    var openid=that.data.openid;
    var myCartArr=that.data.mycart;
    var goodsNum = that.data.buyNumber;

    console.log('****************',goodsNum);
     console.log('postId',postId);
     console.log('openid',that.data.openid);
     console.log('myCartArr',that.data.mycart);
    
     wx.showModal({
      title: '提示',
      content: '是否加入购物车',
      success: function (res) {
        if (res.confirm) {
          console.log('carts1',myCartArr)
          if(myCartArr.length == 0){
            that.addCart(postId)
          }else{
            that.getDoc(()=>{
              var idArr=[];
              myCartArr.forEach(function(item){
                idArr.push(item._id);
            
              })
              if(idArr.indexOf(postId)>-1){
                wx.showToast({
                  title: '请勿重复添加',
                  icon: 'none',
                  duration: 2000
                })
              }else{
                var carts=that.data.mycart
                var doc=that.data.doc;
                var id = that.data.postId
       
                that.updateCart(doc,id)
              }
            })
          }
        } else if (res.cancel) {
            console.log('用户点击取消')
        }
        }
      })
  },
  // 获取个人doc
  getDoc(complete){
    var that=this
    var openid=that.data.openid
    db.collection("cart").where({
      _openid: openid,
    }).get()
      .then(res => {
        console.log("获取doc",res)
         console.log("获取doc",res.data[0]._id)
         that.setData({
          doc: res.data[0]._id,
        })
        if(complete){
          complete()
        }
      })
      .catch(err => {
         console.log("获取购物车数据失败",err);
      })
  },
updateCart(doc,id){
  var that = this;
  db.collection('wxGoodsPost').doc(id).get({
    success: function(e) {
      var openid=that.data.openid
      var carts_ = []
      var _data ={
        _id:e.data._id,
        GoodsName:e.data.GoodsName,
        GoodsCampus:e.data.GoodsCampus,
        nickName:e.data.nickName,
        GoodsPrice:e.data.GoodsPrice,
        imgArr:e.data.imgArr,
        GoodsConditions:e.data.GoodsConditions,
        GoodsNum:e.data.GoodsNum,
        GoodsType:e.data.GoodsType,
        nickName:e.data.nickName,
        // selected:false,
        buyLen:that.data.buyNumber,
      }
      carts_ .push(_data);
      var carts=that.data.mycart
    
      console.log('carts', carts.concat(carts_))
      db.collection('cart').doc(doc).update({
       data:{
        // myCart:addid.concat(carts)
        myCart:carts.concat(carts_)
       }
      }).then(res => {
        console.log('添加更新库存成功', res)
        wx.showToast({
          title: '成功',
            icon: 'success',
            duration: 1000
        })
        that.myCartArr(openid)
      }).catch(err=>{
        console.log('添加更新库存失败',err)
      })
    }})
  
},
addCart(addid){
  var that = this;
  db.collection('wxGoodsPost').doc(addid).get({
    success: function(e) {
      // res.data 包含该记录的数据
      console.log('******************');
      console.log(e.data);
      var carts = []
      var _data ={
        _id:e.data._id,
        GoodsName:e.data.GoodsName,
        GoodsCampus:e.data.GoodsCampus,
        nickName:e.data.nickName,
        GoodsPrice:e.data.GoodsPrice,
        imgArr:e.data.imgArr,
        GoodsConditions:e.data.GoodsConditions,
        GoodsNum:e.data.GoodsNum,
        GoodsType:e.data.GoodsType,
        nickName:e.data.nickName,
        // selected:false,
        buyLen:that.data.buyNumber,
    
      }
      carts.push(_data);
      var openid=that.data.openid
      console.log('openid1', openid)
      db.collection('cart').add({
       data:{
        myCart:carts.concat()
        // myCart:carts
       }
      }).then(res => {
        console.log('添加库存成功', res)
        wx.showToast({
          title: '成功',
            icon: 'success',
            duration: 1000
        })
        that.myCartArr(openid)
      }).catch(err=>{
        console.log('添加库存失败',err)
      })
    }
  })
 
},
  nowBuy() {
      var that=this
      wx.cloud.callFunction({
        // 云函数名称
        name: 'SearchGoodsNum',
        // 传给云函数的参数
        data: {
         id: that.data.postId,
   
        },
        success: function (res) {
          console.log('获取商品信息成功',res)
          if(res.result.data.GoodsNum == 0){
            wx.showToast({
              title: '剩余库存不足',
              icon: 'error',
              duration: 2000
            })

          }else{
        
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
                  });
                  var GoodsCartArr=[]
                  console.log('that.data.postId',that.data.postId)
                  // that.modOrderStatus(that.data.postId,'已售',true,0)//点击购买修改物品信息
                  GoodsCartArr.push(that.data.postId)
                  console.log('GoodsCartArr',GoodsCartArr)
                  var GoodsCartArrId = JSON.stringify(GoodsCartArr)
                  wx.navigateTo({
                    url: '/pages/settlement/settlement?GoodsCartId='+GoodsCartArrId +'&nickname=' + that.data.nickname +'&pnone=' + that.data.pnone+'&Number='+ '0' + '&type= ' + '0' ,
                })
                })
              })
            })  
          }
  
        },
        fail: function (err) {
          console.log(err)
        },
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
  

})