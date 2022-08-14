// pages/movie-detail/movie-detail.js
var app = getApp();
const db = wx.cloud.database();
// import Dialog from '../../../miniprogram_npm/to/vant-weapp/dist/dialog/dialog'
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postId:'',
    mycart:[],
    doc:'',
    openid:'',
    sellopenid:'',
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
    buyNumMin: 0,
    buyNumMax: 100,
    detailData: {},
    nickName: '',
    show: false,
    showadd:false,
    flag:1,
    breakfast: [],//早餐
    lunch : [],//午餐
    dinner:[],//晚餐
    sku_list:[],
    key: [],//
    takeTime:[],
    time:'',
    buyNumMin:1,
    buyNumMax:1,
    buyNumber:1,
    addNumber:1,
    tdindex:0


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

  tobuy: function () {
    var that = this;

          this.setData({
            show: true,
            flag:1
          })

 


  },
    // 添加数量
  toadd:function(){
    var that = this;
    this.setData({
            showadd: true,
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
    this.setData({ showadd: false });
  },
  stepChange(event) {
    this.setData({
      buyNumber: event.detail
    })
    wx.setStorageSync('goodslen', this.data.buyNumber);
  },
  //管理员添加库存
  stepChange1(event) {
    this.setData({
      addNumber: event.detail
    })
    wx.setStorageSync('goodslen', this.data.buyNumber);
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
    
    })
   
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
  db.collection("paotuiDatas").doc(id).get({
    success(res){ 
     console.log("数据获取成功啦",res);
     var list = [];
      that.setData({
        detailData: res.data,
        key:res.data.Package_food
        // buyNumMax:res.data.GoodsNum
      })
      // that.timer();
      console.log("detailData----------------",that.data.detailData);
      that.setData({
        sellopenid:that.data.detailData.sellopenid,
        takeTime:that.data.detailData.Package_time
      })
   
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


  nowReservation(){
    var that=this
    app.getopenid(res => {
      console.log("write cb res", res)
      that.setData({
        openid: res
      })
      that.register(()=>{
        that.Info(()=>{
          if(that.data.time == ''){
            wx.showToast({
              title: '未选择取餐时间',
              icon: 'error',
              duration: 2000
            })
          }else{
      
            Dialog.alert({
              title: '温馨提示',
              message: '疫情期间，请师生错峰就餐!!!',
            }).then(() => {  
          if(that.data.breakfast.length == 0  && that.data.lunch.length ==0  && that.data.dinner.length == 0){
            wx.showToast({
              title: '您未选择餐品',
              icon: 'error',
              duration: 2000
            })
        
          }else{
            wx.showToast({
              title: '正在加载中...',
              icon: 'loading',
              duration:2000
            });
        
                
                  wx.navigateTo({
                    // url: '/pages/settlement/settlement?GoodsCartId='+GoodsCartArrId +'&nickname=' + that.data.nickname +'&pnone=' + that.data.pnone+'&Number='+ '0' + '&type= ' + '0' ,
                    url: '/pages/settlementMeal/settlementMeal?foodId=' + that.data.detailData._id +'&nickname=' + that.data.nickname +'&pnone=' + that.data.pnone+ '&breakfast=' +that.data.breakfast + '&lunch=' + that.data.lunch + '&dinner=' + that.data.dinner + '&buyNumber=' + that.data.buyNumber+ '&info=1' + '&gettime='+ that.data.time
            })
        
           
          
        
          }
           
        
            });
          }
       
        })
      })
    })

   
  },
  addnum(){
   var that =this;
   app.getopenid(res => {
    console.log("write cb res", res)
    that.setData({
      openid: res
    })
    that.register(()=>{
      that.Info(()=>{

        wx.showModal({
          title: '温馨提示',
          content: '您确定要添加库存',
          success (res) {
            if (res.confirm) {
              
         wx.cloud.callFunction({
          // 云函数名称
          name: 'addNum',
          // 传给云函数的参数
          data: {
            id:that.data.detailData._id,
            index:that.data.tdindex,
            Num:that.data.addNumber
          },
          success: function (res) {
            console.log('修改数据成功！！',res)
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 2000
            })
      
          },
       
        })
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      })
    })
  })


  },
  // nowBuy() {
  //     var that=this
  //     wx.cloud.callFunction({
  //       // 云函数名称
  //       name: 'SearchGoodsNum',
  //       // 传给云函数的参数
  //       data: {
  //        id: that.data.postId,
   
  //       },
  //       success: function (res) {
  //         console.log('获取商品信息成功',res)
  //         if(res.result.data.GoodsNum == 0){
  //           wx.showToast({
  //             title: '剩余库存不足',
  //             icon: 'error',
  //             duration: 2000
  //           })

  //         }else{
  //           wx.showToast({
  //             title: '正在加载中...',
  //             icon: 'loading',
  //             duration:2000
  //           });
  //           app.getopenid(res => {
  //             console.log("write cb res", res)
  //             that.setData({
  //               openid: res
  //             })
  //             that.register(()=>{
  //               that.Info(()=>{
  //                 var GoodsCartArr=[]
  //                 console.log('that.data.postId',that.data.postId)
  //                 // that.modOrderStatus(that.data.postId,'已售',true,0)//点击购买修改物品信息
  //                 GoodsCartArr.push(that.data.postId)
  //                 console.log('GoodsCartArr',GoodsCartArr)
  //                 var GoodsCartArrId = JSON.stringify(GoodsCartArr)
  //                 wx.navigateTo({
  //                   url: '/pages/settlement/settlement?GoodsCartId='+GoodsCartArrId +'&nickname=' + that.data.nickname +'&pnone=' + that.data.pnone+'&Number='+ '0' + '&type= ' + '0' ,
  //               })
  //               })
  //             })
  //           })  
  //         }
  
  //       },
  //       fail: function (err) {
  //         console.log(err)
  //       },
  //     })

    
  //   },
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
 
  
    handleClick:function(e){
      //选择商品类型
      let that=this;
      let breakfast= [];
      let lunch = [];
      let dinner = [];
      let state = e.currentTarget.dataset.state;
      let trindex = e.currentTarget.dataset.trindex;
      let tdindex = e.currentTarget.dataset.tdindex;
      console.log('*********',state,trindex,tdindex);
      console.log('----------',e.currentTarget.dataset);
     
      if (state == "sel"){//被选择取反
        this.data.key[trindex][tdindex].state="";
        if(trindex == 0){
          that.data.breakfast.forEach((item,index)=>{
              if(item == tdindex ){
                that.data.breakfast.splice(index,1);
              }
          })
          that.setData({
            breakfast:that.data.breakfast
          })
         }else if (trindex == 1){
          that.data.lunch.forEach((item,index) =>{
            if(item == tdindex ){
              that.data.lunch.splice(index,1);
            }
        })
        that.setData({
          lunch:that.data.lunch
        })
         }else{
          that.data.dinner.forEach((item,index) =>{
            if(item == tdindex ){
              that.data.dinner.splice(index,1);
            }
        })
        that.setData({
          dinner:that.data.dinner
        })
         }
         console.log('-------------------------',that.data.breakfast,that.data.lunch,that.data.dinner);
        //  that.setData({
        //   breakfast:that.data.breakfast,
        //   lunch:that.data.lunch,
        //   dinner:that.data.dinner
        // })
      } else if (state == ""){//选择
        //优化结果
       if(trindex == 0){
        breakfast.push(tdindex);
        that.setData({
          breakfast:that.data.breakfast.concat(breakfast)
        })
       }else if(trindex == 1){
        lunch.push(tdindex);
        that.setData({
          lunch:that.data.lunch.concat(lunch)
        })
       }else{
        dinner.push(tdindex);
        that.setData({
          dinner:that.data.dinner.concat(dinner)
        })
       }
        for (let i = 0; i < this.data.key[trindex].length; i++) {
          if (this.data.key[trindex][i].state=="sel"){
            // this.data.key[trindex][i].state="";
            this.setData({
              key: this.data.key
            })
            break;
          }
        }      
        this.data.key[trindex][tdindex].state = "sel";
        if(trindex==0){
          let selImg=this.data.key[0][tdindex].images;
          this.setData({
            selImg,
          })
        }
         console.log('-------------------------',that.data.breakfast,that.data.lunch,that.data.dinner);
        
      }
      this.setData({
        key:this.data.key
      })
  
      // this.set_block();
      // this.update();
      that.setData({
        selNum:1
      })
      let selLength=0;
      for(let s=0;s<that.data.key.length;s++){
        for(let e=0;e<that.data.key[s].length;e++){
          if (that.data.key[s][e].state=="sel"){
            selLength++;
            break;
          }
        }
      }
      if (selLength == that.data.key.length) {
       
     
     
        if (that.data.selNum > 1) {
          that.setData({
            minuslBan: "",
          })
        } else {
          that.setData({
            minuslBan: "ban",
          })
        }
        if (that.data.selNum>=that.data.selStock){
          that.setData({
           plusBan: "ban",
          })  
        }else{
          that.setData({
            plusBan: "",
          })       
        }
      }else{
        that.setData({
          btnType: "buy-ban",
          selTypeList:"-",
          selStock:"-",
          minusBan:"ban",
          plusBan: "ban",        
        })      
      }   
      that.setData({
        sku_list:that.data.sku_list.concat(that.data.breakfast).concat(that.data.lunch).concat(that.data.dinner)
      })
      console.log('选餐集合',that.data.sku_list);
    },
    handletimeClick:function(e){
    //选择商品类型
    let that=this;
    let state = e.currentTarget.dataset.state;
    let trindex = e.currentTarget.dataset.trindex;
    let tdindex = e.currentTarget.dataset.tdindex;
    console.log('-------------',tdindex);
    that.setData({
      addNumber:that.data.takeTime[0][tdindex].num,
      tdindex:tdindex
    })
  
   
    if (state == "sel"){//被选择取反

      this.data.takeTime[trindex][tdindex].state="";
      that.setData({
        buyNumMax:1,
        time:[]
      })
      console.log('**********',that.data.buyNumMax,that.data.time);
    } else if (state == ""){//选择
      //优化结果
      that.setData({
        buyNumMax:that.data.takeTime[0][tdindex].num,
        time:that.data.takeTime[0][tdindex].val
      })
      console.log('**********',that.data.buyNumMax,that.data.time);
      for (let i = 0; i < this.data.takeTime[trindex].length; i++) {
        if (this.data.takeTime[trindex][i].state=="sel"){
          this.data.takeTime[trindex][i].state="";
          this.setData({
            takeTime: this.data.takeTime
          })
          break;
        }
      }      
      this.data.takeTime[trindex][tdindex].state = "sel";
  
    }
    this.setData({
      takeTime:this.data.takeTime
    })
   
    for(let s=0;s<that.data.takeTime.length;s++){
      for(let e=0;e<that.data.takeTime[s].length;e++){
        if (that.data.takeTime[s][e].state=="sel"){
 
          break;
        }
      }
    }
   

    },
      // //取餐时间
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