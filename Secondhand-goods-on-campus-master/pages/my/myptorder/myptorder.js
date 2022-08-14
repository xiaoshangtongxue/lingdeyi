const db = wx.cloud.database()
const App = getApp()
Page({
  data: {
    scrollTop:0,  //用作跳转后右侧视图回到顶部
    currtab: 0,
    swipertab: [{ name: '正在进行...', index: 0 }, { name: '已完成', index: 1 }],
    startData:[],//已支付数据
    endData:[], //已收货数据
    openid: "",
    orderFormId: "",
    openId:'',
    modtime:'',
  },
  onLoad(options){
    
   
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
    console.log('执行111')
    this.startptorderShow()
  },
  //页面上拉触底事件的处理函数
  onReachBottom: function() {
    console.log("执行",)
    var that=this
    if(that.data.currtab==0){
      that.startptorderShow()
    }else if(that.data.currtab==1){
      that.endptorderShow()
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
          deviceW: res.windowWidth-50,
          deviceH: res.windowHeight-50
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
       startData:[],//已支付数据
       endData:[], //已收货数据
      })
    console.log('执行222')
    this.orderShow()
  },
    orderShow: function () {
      let that = this
      switch (that.data.currtab) {
        case 0:
          that.startptorderShow()
          break
        case 1:
          that.endptorderShow()
          break
     
      }
    },
    startptorderShow: function(){
      var that = this;
      App.getopenid(res => {
        console.log("write cb res", res)
        that.setData({
          openid: res
      },()=>{
        console.log("openid0",res)
        let  len=that.data.startData.length
        console.log("请求成功1", len)
        console.log("that.data.startData", that.data.startData)
        db.collection("ptjoborder").where({
          _openid:res,
          oderIsstatus:false,
           
        }).orderBy('time','desc').skip(len) //从第几个数据开始
          .get().then(rest=>{
              console.log("请求成功2", rest.data)
              if (rest.data.length<=0) {
                console.log("请求成功3", rest.data.length)
                wx.showToast({
                  icon:'none',
                  title:"没有更多数据啦"
                })
              } 
              that.setData({
                startData: that.data.startData.concat(rest.data), //获取数据数组    
              });
            }).catch(res=>{
              console.log("请求失败", res)
            })
          })
      })
    },
    endptorderShow: function(){
      var that = this;
      App.getopenid(res => {
        console.log("write cb res", res)
        that.setData({
          openid: res
        },()=>{
          console.log("openid0",res)
          console.log("请求成功4", len)
          let  len=that.data.endData.length
          db.collection("ptjoborder").where({
            _openid:res,
            oderIsstatus:true,
          })
          .orderBy('time','desc')
            .skip(len) //从第几个数据开始
            .get().then(res=>{
                console.log("请求成功5", res.data)
                if (res.data.length<=0) {
                  console.log("请求成功6", res.data.length)
                  wx.showToast({
                    icon:'none',
                    title:"没有更多数据啦"
                  })
                } 
                that.setData({
                  endData: that.data.endData.concat(res.data), //获取数据数组    
                });
              }).catch(res=>{
                console.log("请求失败", res)
              })
        })
     
    })  
    },
  
  // 跳转到详情页
  startDataDetail(e){
    var that=this
    console.log(e.currentTarget.id);
    that.setData({
      orderFormId: that.data.startData[e.currentTarget.id]._id
    });
   console.log("ID", that.data.orderFormId);
   wx.redirectTo({
    url: '/pages/my/myptorderDetail/myptorderDetail?id='+that.data.orderFormId+'&Index='+"0"+'&openId='+that.data.openId,
   })
  },
  
})
