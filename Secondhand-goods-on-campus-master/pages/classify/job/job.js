const db = wx.cloud.database()
Page({
  data: {

    currentTab: 0,  //对应样式变化
    scrollTop:0,  //用作跳转后右侧视图回到顶部
    screenArray:[], //左侧导航栏内容
    screenType:0,  //后台查询需要的字段
    childrenArray:[], //右侧内容
    imgUrls:[],//轮播图
    curNav: 0,
    flag:true,
  },
  onLoad: function (options) {
    var that = this;
    //获得分类筛选
    console.log("执行")
    that.imgShow();
    that.setListHeight();
    that.goodtype(()=>{
      that.jobtypeChildrenArray(that.data.screenType)
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
          scrollHeight: res.windowHeight - 52,
        });
      }
    });
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
          screenArray: res.data[1].Detail,
          screenType:res.data[1].Detail[0],
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
jobtypeChildrenArray(screenType){
  var that=this
  let len=that.data.childrenArray.length
      db.collection("wxjobpost").where({
        jobType:screenType,
        status:'未售',
        isviolation:false,
      }).orderBy('Time','desc')
      .skip(len) //从第几个数据开始
      .get().then(res=>{
          console.log("请求成功8", res.data)
          console.log("length",res.data.length)
          if (res.data.length<=0){
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
    that.jobtypeChildrenArray(screenType)
  },
  //页面上拉触底事件的处理函数
  onReachBottom: function() {
    console.log("执行",)
    var that=this
    var Id=Number(that.data.curNav)
    var screenType =that.data.screenArray[Id] ;
    that.jobtypeChildrenArray(screenType)
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

searchDetail:function (){
    wx.navigateTo({
      url: '/pages/classify/job-search/job-search',
    })
  },
//   /**
//    * 设置分享内容
//    */
  onShareAppMessage: function () {
    return {
      title: "校园兼职",
      path: "/pages/classify/job/job"
    };
  }
})
