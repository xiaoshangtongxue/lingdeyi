const db = wx.cloud.database()
const App = getApp()
Page({
  data: {
    currtab: 0,
    swipertab: [{ name: '百货', index: 0 }, { name: '跑腿', index: 1 },{ name: '兼职', index: 2 }],
    goodPost:[],//百货数据
    paotuiPost:[],//跑腿数据
    jobPost:[], //兼职数据
    scrollTop:0,  //用作跳转后右侧视图回到顶部
    openid: "",
    orderFormId: "",
    mchId:'',
    btninfo:false,
    _id:''
  },
  onLoad(options){
    var that=this
    // console.log("options",Number(options.goCurrtab))
    // that.setData({
    //   currtab:Number(options.goCurrtab)
    // })
    // console.log("123",that.data.currtab)
   
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
    var that=this
    if(that.data.currtab==0){
      console.log('0',that.data.currtab)
      that.goodsShow()
    }

  },
  //页面上拉触底事件的处理函数
  onReachBottom: function() {
    console.log("执行",)
    var that=this
    if(that.data.currtab==0){
      console.log('00',that.data.currtab)
      that.goodsShow()
    }else if(that.data.currtab==1){
      console.log('11',that.data.currtab)
      that.ptjobShow()
    }else{
      console.log('22',that.data.currtab)
      that.jobShow()
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
    this.setData({ currtab: e.detail.current })
    console.log('执行222')
    this.orderShow()
  },
    orderShow: function () {
      let that = this
      switch (that.data.currtab) {
        case 0:
          that.goodsShow()
          break
        case 1:
          that.ptjobShow()
          break
        case 2:
          that.jobShow()
          break
      }
    },
    goodsShow: function(){
      var that = this;
      App.getopenid(res => {
        console.log("write cb res", res)
        that.setData({
          openid: res
      },()=>{
        console.log("openid0",res)
        let  len=that.data.goodPost.length
        console.log("请求成功1", len)
        db.collection("wxGoodsPost").where({
          _openid:that.data.openid
        }).orderBy('Time','desc')
          .skip(len) //从第几个数据开始
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
                goodPost: that.data.goodPost.concat(rest.data), //获取数据数组    
              });
              console.log('****************')
              console.log(that.data.goodPost);
            }).catch(res=>{
              console.log("请求失败", res)
            })
      })
     })
    },


    ptjobShow: function(){
      var that = this;
      App.getopenid(res => {
        console.log("write cb res", res)
        that.setData({
          openid: res
        },()=>{
          console.log("openid0",res)
          let len=that.data.paotuiPost.length
          console.log("请求成功4", len)
          wx.cloud.database().collection("paotuiDatas").where({
            _openid:that.data.openid
          })
          .orderBy('Time','desc')
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
                  paotuiPost: that.data.paotuiPost.concat(res.data), //获取数据数组    
                });
              console.log('******--------')
              console.log('paotuiPost',that.data.paotuiPost);
              }).catch(res=>{
                console.log("请求失败", res)
              })
        })
     
    })  
    },
    jobShow: function(){
      var that = this;
      App.getopenid(res => {
        console.log("write cb res", res)
        that.setData({
          openid: res
        },()=>{
          console.log("openid0",res)
          let  len=that.data.jobPost.length
          console.log("请求成功7", len)
          db.collection("wxjobpost").where({
            _openid:that.data.openid
          })
          .orderBy('Time','desc')
            .skip(len) //从第几个数据开始
            .get().then(res=>{
                console.log("请求成功8", res.data)
                if (res.data.length<=0) {
                  console.log("请求成功9", res.data.length)
                  wx.showToast({
                    icon:'none',
                    title:"没有更多数据啦"
                  })
                } 
                that.setData({
                  jobPost: that.data.jobPost.concat(res.data), //获取数据数组    
                });
                
              }).catch(res=>{
                console.log("请求失败", res)
              })
        })
     
    })  
    }, 

  // 跳转到详情页
  goToGoodPostDetail(e){
    var that=this
    console.log(e.currentTarget.id);
    console.log(that.data.bookPost);
    that.setData({
      orderFormId: that.data.goodPost[e.currentTarget.id]._id
    });
   console.log("ID", that.data.orderFormId);
   wx.redirectTo({
    url: '../myPostDetail/myPostDetail?orderFormId='+that.data.orderFormId+'&Index='+"0",
  })
  },
  goToptJobDetail(e){
    console.log(e.currentTarget.id);
    this.setData({
      orderFormId: this.data.paotuiPost[e.currentTarget.id]._id
    });
    console.log("ID", this.data.orderFormId);
    wx.redirectTo({
      url: '../myPostDetail/myPostDetail?orderFormId='+this.data.orderFormId+'&Index='+"1",
    })
  },
  goToJobPostDetail(e){
   console.log(e.currentTarget.id);
    this.setData({
      orderFormId: this.data.jobPost[e.currentTarget.id]._id
    });
    console.log("ID", this.data.orderFormId);
   wx.redirectTo({
      url: '../myPostDetail/myPostDetail?orderFormId='+this.data.orderFormId+'&Index='+"2",
    })
  },

  ptJobdetermine:function(e){  //确认收货
    var that = this;
    wx.showModal({
      title: '提示',
      content: '您确定已经收到货了吗',
      success (res) {
        if (res.confirm) {
          console.log(e.currentTarget.id);
          console.log(that.data.paotuiPost)
          that.setData({
            orderFormId: that.data.paotuiPost[e.currentTarget.id]._id
          });
          console.log(that.data.orderFormId);
          wx.cloud.callFunction({
            // 云函数名称
          name: 'shouhuo2',
                // 传给云函数的参数
          data: {
            id:that.data.orderFormId,
            sureOrder:true,
            sureOrderstatus:'已收货'
          },
      success: function (res) {
        wx.cloud.callFunction({
          // 云函数名称
        name: 'shouhuo',
              // 传给云函数的参数
        data: {
          id:that.data.orderFormId,
          sendStatus:'已送达',
          oderIsstatus:true,
          orderinfo:'已完成'
        },
        success: function (res) {
          that.setData({
            paotuiPost:[]
          })
          that.ptjobShow()
          // wx.navigateTo({
          //   url:  '/pages/my/myPost/myPost?goCurrtab='+Number(1),
          // }) 
        }})
        


        }

      })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
})