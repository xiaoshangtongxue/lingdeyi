// pages/evaluateDetail/evaluateDetail.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop:0,  //用作跳转后右侧视图回到顶部

    currtab: 0,
    swipertab: [{ name: '待收货', index: 0 }, { name: '已收货', index: 1 }],
    resultList:[],//已收货数据
    waitresultList:[],//待收货数据
    openid:'',
    resultListlength:0,
    resultListShow:true,
    noResultListShow:false,
    waitresultListlength:0,
    waitresultListShow:true,
    waitnoResultListShow:false
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   

  },
  onClick(event) {
    var that = this;
    that.setData({
      currtab:event.detail.name,
      // _id:options.id
    })
    that.orderShow();
    console.log('-------------------',that.data.currtab)

  },
   //页面显示的事件
   onShow:function() {
    this.waitresultListShow()
  },
    //页面上拉触底事件的处理函数
    onReachBottom: function() {
      console.log("执行",)
      var that=this
      if(that.data.currtab==0){
        that.waitresultListShow()
      }else{
        that.resultListShow()
      } 
    },
   /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('执行')
    this.getDeviceInfo()
    //this.orderShow()
  },
  getDeviceInfo: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceW: res.windowWidth,
          deviceH: res.windowHeight
        })
      }
    })
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
       waitresultList:[],
      })
    console.log('执行222')
    this.orderShow()
  },
    orderShow: function () {
      let that = this
      switch (that.data.currtab) {
        case 0:
          that.waitresultListShow()
          break
        case 1:
          that.resultListShow()
          break
      }
    },
    resultListShow: function(){
      var that = this;
      app.getopenid(res => {
        console.log("write cb res", res)
        that.setData({
          openid: res
      },()=>{
      let that = this;
      let len=that.data.resultList.length
      db.collection('GoodsOrderInfo').where({
        _openid:that.data.openid,
        GoodsStatus:'已收货'
      }).orderBy('BuyTimeStamp','desc')
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
          })
      })
    },
    waitresultListShow: function(){
      var that = this;
      app.getopenid(res => {
        console.log("write cb res", res)
        that.setData({
          openid: res
      },()=>{
      let that = this;
      let len=that.data.waitresultList.length
      db.collection('GoodsOrderInfo').where({
        _openid:that.data.openid,
        GoodsStatus:'待收货'
      }).orderBy('BuyTimeStamp','desc')
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
       var waitresultListlength=that.data.waitresultListlength
        that.setData({
          waitresultListlength:waitresultListlength+res.data.length,
          waitresultList: that.data.waitresultList.concat(res.data), //获取数据数组    
        },()=>{
          if(that.data.waitresultListlength==0){
            that.setData({
              waitresultListShow:false,
              waitnoResultListShow:true
            })
          }
        });
        console.log("resultListlength",that.data.waitresultListlength)
    }).catch(res=>{
      console.log("请求失败", res)
    })
          })
      }) 
    },
})