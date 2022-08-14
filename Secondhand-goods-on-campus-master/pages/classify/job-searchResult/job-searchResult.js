const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    resultList:[],
    resultListlength:0,
    resultListShow:true,
    noResultListShow:false
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
     that.jobProductList()
   })
  },
  jobProductList(){
    let that = this;
    let len=that.data.resultList.length
      console.log("请求成功7", len)
    db.collection('wxjobpost').where(_.or([{
      jobName: db.RegExp({
        regexp: '.*' + that.data.keyWord,
        options: 'i',
      }),
      status:"未售",
      isviolation:false,
      
    },
    {
      jobType: db.RegExp({
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
    that.jobProductList()

  },
  searchDetail:function (){
    wx.navigateTo({
      url: '/pages/classify/job-search/job-search',
    })
  },
  toGoodsDetail(e) {
    var id = e.currentTarget.dataset.id;
    console.log('id', id);
    wx.navigateTo({
      url: '/pages/classify/jobDetail/jobDetail?id=' + id, //跳转到兼职详情页
    })
  },
  onPageScroll: function (e) {//监听页面滚动
    this.setData({
      indexSearch: e.scrollTop
    })
  },

});
