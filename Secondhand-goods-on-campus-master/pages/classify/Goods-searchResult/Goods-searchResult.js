const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    resultList:[],
    resultListlength:0,
    resultListShow:true,
    noResultListShow:false,
    satatus:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    var that = this;
    var keyWord=options.keyWord
    console.log('keyWord',keyWord);
    // 设置商品列表高度
   that.setData({
    keyWord:keyWord
   },()=>{
     that.GoodsProductList()
   })
  },
  GoodsProductList(){
    let that = this;
    let len=that.data.resultList.length
      console.log("请求成功7", len)
    db.collection('wxGoodsPost').where(_.or([{
      GoodsName: db.RegExp({
        regexp: '.*' + that.data.keyWord,
        options: 'i',
      }),
      status:"未售",
      isviolation:false,
      
    },
    {
      GoodsType: db.RegExp({
        regexp: '.*' + that.data.keyWord,
        options: 'i',
      }),
      status:"未售",
      isviolation:false,
    }
  ])).orderBy('Time','desc')
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
/* onPageScroll: function (e) {//监听页面滚动
  this.setData({
    scrollTop: e.scrollTop
  })
}, */
  //页面上拉触底事件的处理函数
  onReachBottom: function() {
    console.log("执行",)
    var that=this
    that.GoodsProductList()

  },
  searchDetail:function (){
    wx.navigateTo({
      url: '/pages/classify/Goods-search/Goods-search',
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
        if(that.data.satatus=='未售'){
          wx.navigateTo({
            url: '/pages/classify/GoodsDetail/GoodsDetail?id=' + id, 
          })
        }else{
          wx.showToast({
            title: '此商品已售',
            icon: 'none',
            duration:2000
          });
          return
        }
    })
   
  },
  onPageScroll: function (e) {//监听页面滚动
    this.setData({
      indexSearch: e.scrollTop
    })
  },
/**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that=this
    wx.setNavigationBarTitle({
      title: '物品详情'
    });
    console.log('zhixing')
   that.setData({
    resultList:[],
    resultListlength:0,
    resultListShow:true,
    noResultListShow:false,
    satatus:''
   }) 
    that.GoodsProductList()
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标
    setTimeout(function () {
      wx.stopPullDownRefresh(); //停止加载
      wx.hideNavigationBarLoading(); //隐藏加载icon
    }, 2000)
  },


});
