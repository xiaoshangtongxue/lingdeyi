const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    currentTab: 0,  //对应样式变化
    scrollTop:0,  //用作跳转后右侧视图回到顶部
    screenArray:[], //左侧导航栏内容
    screenType:0,  //后台查询需要的字段
    childrenArray:[], //右侧内容
    imgUrls:[],//轮播图
  //  scrollHeight: 0,
    school:'坞城校区',
    curNav: 0,
    orderType:"",//排序标记
    sortPrice:'',
    flag:true,
  },
  onLoad: function (options) {
    var that = this;
    //获得分类筛选
    console.log("执行")
    that.imgShow();
    that.setListHeight();
    that.goodtype(()=>{
      that.goodstypeChildrenArray(that.data.screenType,that.data.orderType,true,that.data.school)
    })
  },
    /**
   * 设置分类列表高度
   */
  setListHeight: function () {
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          scrollHeight: res.windowHeight - 108,
        });
      }
    });
  },
  // 搜索
  searchDetail:function (){
    wx.navigateTo({
      url: '/pages/classify/Goods-search/Goods-search',
    })
  },
  // 跳转物品详情页
  // 进详情页之前检测是否已售
isBuy(id,success){
  var that=this
  db.collection("wxGoodsPost").doc(id).get().then(res=>{
    console.log("请求成功80", res.data) 
    that.setData({
      satatus:res.data.status,
      GoodsNum:res.data.GoodsNum
    })
      success()
}).catch(res=>{
    console.log("请求失败", res)
})
},
  toGoodsDetail(e) {
    var that=this
    var id = e.currentTarget.dataset.id;
    console.log('id', id);
    that.isBuy(id,()=>{
        console.log('获取成功111',that.data)
        if(that.data.GoodsNum > 0 ){
          wx.navigateTo({
            url: '/pages/classify/GoodsDetail/GoodsDetail?id=' + id, 
          })
        }else{
          wx.showToast({
            title: '此商品库存不足',
            icon: 'none',
            duration:2000
          });
          return
        }
    })
   
  },
  //      //校区下拉选择
  bindShowMsg() {

    this.setData({
        select:!this.data.select,
    
    })
  
},
mySelect(e) {
  var name = e.currentTarget.dataset.name
  var that = this;

  that .setData({
      school: name,
      select: false,
      childrenArray:[],
  })
 that.goodstypeChildrenArray(that.data.screenType,that.data.orderType,true,that.data.school)
//  that.school(that.data.screenType,that.data.orderType,true,that.data.school)
},
  //     //轮播图
  imgShow:function(){
    var _this = this
    db.collection('swiper').get({         
      success: function (res) {
 
          console.log('轮播图获取成功',res)
          _this.setData({
            imgUrls: res.data,
          })
          console.log('imgUrls',_this.data.imgUrls)
      },
      fail: function (res) {
          console.log('轮播图获取失败', res)
      }
    })
  },
  // 左边
  goodtype(complete){
    var that=this
    db.collection("categoryDetail").get({
      success(res) {
        console.log("数据库获取成功", res)
        that.setData({
          screenArray: res.data[0].Detail,
          screenType:res.data[0].Detail[0],
        })
        if(complete){
          complete()
        }
      },
      fail(res) {
        console.log("数据库获取失败", res);
      }
    })
  },
// 右边
goodstypeChildrenArray(screenType,odertype,flag,schoolSelect){

  var that=this
  let len=that.data.childrenArray.length
  var tem = null;
  console.log(odertype);
  console.log('screenType',screenType);
      db.collection("wxGoodsPost").where({
        GoodsType:screenType,
        GoodsCampus:schoolSelect,
        // status:'未售',
        isviolation:false,
        GoodsNum:_.gt(0)
      }).orderBy('Time','desc')
      .skip(len) //从第几个数据开始
      .get().then(res=>{
          console.log("请求成功8", res.data)
          console.log("length",res.data.length)
          if (res.data.length<=0 && flag) {
            console.log("请求成功9", res.data.length)
            wx.showToast({
              icon:'none',
              title:"没有更多数据啦"
            })
            console.log("没有更多数据啦",)
          } 
            that.setData({
              childrenArray: that.data.childrenArray.concat(res.data), //获取数据数组    
            });
      var list = that.data.childrenArray;
      if(odertype == 'PRICE_ASC'){
        for(var i = 0; i <list.length - 1; i++){
          for(var j = 0; j <list.length - 1 - i; j++ ){
             if(parseInt(list[j].GoodsPrice) < parseInt(list[j+1].GoodsPrice)){
                 tem = list[j];
                 list[j] = list[j+1];
                 list[j+1] = tem;
             }
          }
        }
      }
      else if(odertype == 'PRICE_DESC'){
        for(var i = 0; i < list.length - 1; i++){
          for(var j = 0; j < list.length - 1 - i; j++ ){
             if(parseInt(list[j].GoodsPrice) > parseInt(list[j+1].GoodsPrice)){
                 tem =list[j];
                 list[j] = list[j+1];
                 list[j+1] = tem;
             }
          }
        }
      }else if(that.data.orderType == 'TOP_DESC' ){
          list = that.data.childrenArray.reverse();
       }
    
  
      that.setData({
        childrenArray: list, //分类后 重新加载数据
        
      });
      console.log(that.data.childrenArray)
        }).catch(res=>{
          console.log("请求失败", res)
        })
},

  navbarTap:function(e){
    var that = this;
    let curNav = e.target.dataset.index;
    console.log(e);
    this.setData({
       curNav,
       scrollTop: 0,   //切换导航后，控制右侧滚动视图回到顶部
    })
    //刷新右侧内容的数据
    var Id=Number(that.data.curNav)
    var screenType =that.data.screenArray[Id] ;
    console.log("screenType",screenType)
    that.setData({
      childrenArray: [],  
      screenType:screenType
    })
    that.goodstypeChildrenArray(screenType,that.data.orderType,true,that.data.school)
  },
  //页面上拉触底事件的处理函数
  onReachBottom: function() {
    console.log("执行",)
    var that=this
    var Id=Number(that.data.curNav)
    var screenType =that.data.screenArray[Id] ;
    // that.school(screenType,that.data.odertype,true,that.data.school)
    that.goodstypeChildrenArray(screenType,that.data.odertype,true,that.data.school)

  },
     /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('执行123456789')
  
  },
  onPageScroll: function (e) {//监听页面滚动
    this.setData({
      indexSearch: e.scrollTop
    })
  },
    /**
   * 切换排序方式
   */
  switchSortType: function (e) {
    let _this = this
      , orderType
      , newSortType = e.currentTarget.dataset.type
      , newSortPrice = newSortType === 'price' ? !_this.data.sortPrice : true;
    
    if (newSortType === 'price') {
      orderType = newSortPrice ? 'PRICE_ASC' : 'PRICE_DESC';
      
    } else if (newSortType === 'sales') {
      orderType = 'SALES_DESC';
       
  
    } else {
      orderType = 'TOP_DESC';
    }
  
    _this.setData({
      sortPrice: newSortPrice,
      orderType: orderType,
    },
     function () {
       console.log(_this.data.orderType)
      // 获取商品列表
      if(_this.data.orderType != 'SALES_DESC')
      {
        _this.goodstypeChildrenArray(_this.data.screenType,_this.data.orderType,false,_this.data.school);
      }
   
      

 
    }
    );
  },

//   /**
//    * 设置分享内容
//    */
  onShareAppMessage: function () {
    return {
      title: "校园百货",
      path: "/pages/classify/Goods/Goods"
    };
  }
})
