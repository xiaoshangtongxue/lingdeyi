// pages/shouye/shouye.js
// 此处的变量时search功能所需的
const db = wx.cloud.database()
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 首页的轮播图
    imgUrls: [],
    msgList:[],
    //背景颜色 */
    pageBackgroundColor: 'transparent',
    currtab: 0,
    swipertab: [{ name: '推荐好物', index: 0 }, { name: '热卖', index: 1 }],
    resultList:[],
    resultListlength:0,
    resultListShow:true,
    noResultListShow:false,
    hotsaleresultList:[],
    hotsaleresultListlength:0,
    hotsaleresultListShow:true,
    hotsalenoResultListShow:false,
    satatus:''
  },

  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.news()
    that.swiper()
    that.GoodsProductListShow()
    console.log('swipertab',that.data.swipertab)
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('*****************');
  

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 页面渲染完成
    this.getDeviceInfo()
  },
    getDeviceInfo: function () {
    let that = this
   wx.getSystemInfo({
       success: function (res) {
      console.log('高度', res)
        that.setData({
          deviceW: res.windowWidth-20,
          deviceH: res.windowHeight-20
      })
  }
})
},
  // 获取轮播图
  swiper(){
    var  that=this
    db.collection('swiper').get({
      success: function (res) {
          console.log('轮播图获取成功',res)
          that.setData({
            imgUrls: res.data,
          })
          console.log('imgUrls',that.data.imgUrls)
      },
      fail: function (res) {
          console.log('轮播图获取失败', res)
      }
  })
  },

  news(){
    var that=this
    db.collection('news').get({
      success: function (res) {
        console.log('获取数据成功',res.data) 
        var news=res.data
        console.log('news.length',news.length) 
       console.log('news',news) 
       that.setData({
        msgList:news
       })
       console.log('msgList',that.data.msgList) 
      },
      fail: function (res) {
          console.log('获取失败', res)
      }
   })
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
  toGoodsDetail(e) {
    var that=this
    var id = e.currentTarget.dataset.id;
    console.log('id', id);
    that.isBuy(id,()=>{
        console.log('获取成功111',that.data.satatus)
        if(that.data.GoodsNum !== 0){
          wx.navigateTo({
            url: '/pages/classify/GoodsDetail/GoodsDetail?id=' + id, 
          })
        }else{
          wx.showToast({
            title: '此商品库存不足！',
            icon: 'error',
            duration:2000
          });
          return
        }
    })
   
  },
    //页面上拉触底事件的处理函数
  onReachBottom: function() {
    console.log("执行",)
    var that=this
    if(that.data.currtab==0){
      that.GoodsProductListShow()
    }else{
      that.GoodsProductListShow()
    }
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
       resultList:[],
      resultListlength:0,
      resultListShow:true,
      noResultListShow:false,
      hotsaleList:[],
      hotsaleresultListlength:0,
      hotsaleresultListShow:true,
      hotsalenoResultListShow:false,
      })
    console.log('执行222')
    this.orderShow()
  },
    orderShow: function () {
      let that = this
      switch (that.data.currtab) {
        case 0:
          that.GoodsProductListShow()
          break
        case 1:
          that.hotsaleGoodsProductListShow()
          break
      }
    },
    GoodsProductListShow(){
      let that = this;
      let len=that.data.resultList.length
        console.log("请求成功7", len)
      db.collection('wxGoodsPost').where({

        isRecommend:true,

      }).orderBy('Time','desc')
    .skip(len) //从第几个数据开始
    .get().then(res=>{
      console.log("请求成功8", res.data)
      console.log("length",res.data.length)
      if (res.data.length<=0) {
        console.log("请求成功9", res.data.length)
        wx.showToast({
          icon:'none',
          title:"没有更多数据啦"
        })
        console.log("没有更多数据啦",)
      } 
       var resultListlength=that.data.resultListlength
        that.setData({
          resultListlength:resultListlength+res.data.length,
          resultList: that.data.resultList.concat(res.data), //获取数据数组    
        },()=>{
          if(that.data.resultListlength==0){
            that.setData({
              resultListShow:false,
              noResultListShow:true
            })
          }
        });
        console.log("resultListlength",that.data.resultListlength)
    }).catch(res=>{
      console.log("请求失败", res)
    })
    },
    hotsaleGoodsProductListShow(){
      let that = this;
      let len=that.data.hotsaleresultList.length
        console.log("请求成功7", len)
      db.collection('wxjobpost').where({
        status: '未售',
        isRecommend:true,
        isviolation:false,
      }).orderBy('Time','desc')
    .skip(len) //从第几个数据开始
    .get().then(res=>{
      console.log("请求成功8", res.data)
      console.log("length",res.data.length)
      if (res.data.length<=0) {
        console.log("请求成功9", res.data.length)
        wx.showToast({
          icon:'none',
          title:"没有更多数据啦"
        })
        console.log("没有更多数据啦",)
      } 
       var hotsaleresultListlength=that.data.hotsaleresultListlength
        that.setData({
          hotsaleresultListlength:hotsaleresultListlength+res.data.length,
          hotsaleresultList: that.data.hotsaleresultList.concat(res.data), //获取数据数组    
        },()=>{
          if(that.data.hotsaleresultListlength==0){
            that.setData({
              hotsaleresultListShow:false,
              hotsalenoResultListShow:true
            })
          }
        });
        console.log("hotsaleresultListlength",that.data.hotsaleresultListlength)
    }).catch(res=>{
      console.log("请求失败", res)
    })
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
      title: '校园二手交易'
    });
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标
    setTimeout(function () {
      wx.stopPullDownRefresh(); //停止加载
      wx.hideNavigationBarLoading(); //隐藏加载icon
    }, 2000)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //搜索功能
  bindSearchGoods() {
    wx.navigateTo({
      url: '../classify/Goods-search/Goods-search',
    })
  },
  
  //点击“更多”
  bindToMoreGoods(){
    wx.navigateTo({
      url: '../sonShouye/moreGoods/moreGoods',
    })
  },
  bindToMoreJob(){
    wx.navigateTo({
      url: '../sonShouye/moreJob/moreJob',
    })
  },
})

