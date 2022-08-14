const db = wx.cloud.database()
const App = getApp()
Page({
  data: {
    currtab: 0,
    scrollTop:0,  //用作跳转后右侧视图回到顶部
    swipertab: [{ name: '买家', index: 0 }, { name: '卖家', index: 1 }],
    buydata:[],//百货数据
    saledata:[],//跑腿数据
    openid: "",
    orderFormId: "",
    mchId:'',
    btninfo:false,
    _id:'',
    buyNumber:1,
    Package_food:[],
    Note:'',
    Package_time:'',
    isstatus:false,
    id:'',
    nickname:'',
    pnone:''
  },
  onLoad: function (options){
    var that=this
    // console.log("options",Number(options.goCurrtab))
    // console.log("----------------",options)
    that.setListHeight();
    // that.setData({
    //   currtab:Number(options.goCurrtab),
    //   // _id:options.id
    // })

    // console.log("_id5555555555555555555",that.data._id)
  
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
      that.buyShow();
    }
 
    // that.saleShow();

  },
  //页面上拉触底事件的处理函数
  onReachBottom: function() {
    console.log("执行上拉函数",)
    var that=this
    if(that.data.currtab==0){
      console.log('00',that.data.currtab)
      that.buyShow()
    }else{
      console.log('11',that.data.currtab)
      that.saleShow()
    }
  },
  // onPageScroll: function (e) {//监听页面滚动
  //   this.setData({
  //     scrollTop: e.scrollTop
  //   })
  // },
     /**
   * 设置分类列表高度
   */
  setListHeight: function () {
    let _this = this;
    console.log('--------------');
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          scrollHeight: res.windowHeight - 108,
        });
      }
    });
  },
   /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('执行')
    // this.getDeviceInfo()
    //this.orderShow()
  },
  // getDeviceInfo: function () {
  //   let that = this
  //   wx.getSystemInfo({
  //     success: function (res) {
  //       that.setData({
  //         deviceW: res.windowWidth-50,
  //         deviceH: res.windowHeight-50
  //       })
  //     }
  //   })
  // }, 
  /**
  * @Explain：选项卡点击切换
  */
//  tabSwitch: function (e) {
//   var that = this
//   console.log('current1',e.target.dataset.current)
//   if (that.data.currtab === e.target.dataset.current) {
//     return false
//   } else {
//     that.setData({
//       currtab: e.target.dataset.current,
//       scrollTop: 0,   //切换导航后，控制右侧滚动视图回到顶部
//     })
//   }
// },

//   tabChange: function (e) {
//     console.log('current',e.detail.current)
//     this.setData({ currtab: e.detail.current })
//     console.log('执行222')
//     this.orderShow()
//   },
    orderShow: function () {
      let that = this
      switch (that.data.currtab) {
        case 0:
          that.buyShow()
          break
        case 1:
          that.saleShow()
          break
      
      }
    },
    buyShow: function(){
      var that = this;
      var nowTime = formatDate3(new Date().getTime())
      App.getopenid(res => {
        console.log("write cb res", res)
        that.setData({
          openid: res
      },()=>{
        console.log("openid0",res)
        let len=that.data.buydata.length
        console.log('数据长度-----',len);
        console.log("数据***********", that.data.buydata)
        db.collection("FoodOrderInfo").where({
          _openid:that.data.openid,
          nowTime:nowTime
        }).orderBy('BuyTime','desc').skip(len) //从第几个数据开始
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
                buydata: that.data.buydata.concat(rest.data) //获取数据数组    
              });
              var list = [];
              that.data.buydata.forEach(item =>{
                if(item.status == '未接单'){
                  list.push(item);
                }
      
             }),
             that.data.buydata.forEach(item =>{
              if(item.status == '已接单'){
                list.push(item);
              }
    
           }),
           that.data.buydata.forEach(item =>{
            if(item.status == '已完成'){
              list.push(item);
            }
  
         }),
             console.log('-------')
             console.log(list);
             that.setData({
              buydata: list //获取数据数组    
            });
              console.log('****************')
              console.log(that.data.buydata);
            }).catch(res=>{
              console.log("请求失败", res)
            })
      })
     })
    },


    saleShow: function(){
      var that = this;
      var nowTime = formatDate3(new Date().getTime())
      App.getopenid(res => {
        console.log("write cb res", res)
        that.setData({
          openid: res
        },()=>{
          console.log("openid0--------",that.data.openid)
          let len=that.data.saledata.length
          console.log("请求成功4", len)
          wx.cloud.database().collection("FoodOrderInfo").where({
            sellopenid:that.data.openid,
            nowTime:nowTime
          })
          .orderBy('BuyTime','desc')
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
                  saledata: that.data.saledata.concat(res.data), //获取数据数组    
                });
                var list = [];
                that.data.saledata.forEach(item =>{
                  if(item.status == '未接单'){
                    list.push(item);
                  }
        
               }),
               that.data.saledata.forEach(item =>{
                if(item.status == '已接单'){
                  list.push(item);
                }
      
             }),
             that.data.saledata.forEach(item =>{
              if(item.status == '已完成'){
                list.push(item);
              }
    
           }),
           that.setData({
            saledata: list //获取数据数组    
          });
              console.log('******--------')
              console.log('saledata',that.data.saledata);
              }).catch(res=>{
                console.log("请求失败", res)
              })
        })
     
    })  
    },
  // 跳转到详情页
  goTobuydataDetail(e){
    var that=this
    console.log('++++++++++++++++++',e.currentTarget.id);
    that.setData({
      orderFormId: that.data.buydata[e.currentTarget.id].id,
      buyNumber:that.data.buydata[e.currentTarget.id].buyLen,
      nickname:that.data.buydata[e.currentTarget.id].nickName,
      pnone:that.data.buydata[e.currentTarget.id].buyphone,
      Note:that.data.buydata[e.currentTarget.id].Note,
      Package_food:that.data.buydata[e.currentTarget.id].Package_food,
      Package_time:that.data.buydata[e.currentTarget.id].Package_time,
      isstatus:that.data.buydata[e.currentTarget.id].isstatus,
      id: that.data.buydata[e.currentTarget.id]._id,
    });
   console.log("ID", that.data.orderFormId);

   wx.redirectTo({
    url: '/pages/settlementMeal/settlementMeal?foodId=' + that.data.orderFormId +'&nickname=' + that.data.nickname +'&pnone=' + that.data.pnone+ '&buyNumber=' + that.data.buyNumber +"&Note=" +that.data.Note + '&info=0' +'&Package_food=' + that.data.Package_food+'&Package_time=' +that.data.Package_time+'&isstatus=' +that.data.isstatus+'&id='+that.data.id
    // url: '../myPostDetail/myPostDetail?orderFormId='+that.data.orderFormId+'&Index='+"0",
  })
  },
  goTosaleDetail(e){
    var that=this
    console.log('++++++++++++++++++',e.currentTarget.id);
    that.setData({
   
      orderFormId: that.data.saledata[e.currentTarget.id].id,
      buyNumber:that.data.saledata[e.currentTarget.id].buyLen,
      nickname:that.data.saledata[e.currentTarget.id].nickName,
      pnone:that.data.saledata[e.currentTarget.id].buyphone,
      Note:that.data.saledata[e.currentTarget.id].Note,
      Package_food:that.data.saledata[e.currentTarget.id].Package_food,
      Package_time:that.data.saledata[e.currentTarget.id].Package_time,
      id: that.data.saledata[e.currentTarget.id]._id,
    });
    console.log('***-------------66666666666',that.data.nickname,that.data.pnone,that.data.Package_food,that.data.Package_time);
   console.log("ID", that.data.orderFormId);

   wx.redirectTo({
    url: '/pages/settlementMeal/settlementMeal?foodId=' + that.data.orderFormId +'&nickname=' + that.data.nickname +'&pnone=' + that.data.pnone+ '&buyNumber=' + that.data.buyNumber +"&Note=" +that.data.Note + '&info=0' +'&Package_food=' + that.data.Package_food+'&Package_time=' +that.data.Package_time+'&_id=' +that.data.id
    // url: '../myPostDetail/myPostDetail?orderFormId='+that.data.orderFormId+'&Index='+"0",
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

  determine:function(e){  //确认收货
    var that = this;
    wx.showModal({
      title: '提示',
      content: '您确定要接单吗?',
      success (res) {
        if (res.confirm) {
          console.log(e.currentTarget.id);
          console.log(that.data.saledata)
          that.setData({
            orderFormId: that.data.saledata[e.currentTarget.id]._id
          });
          console.log('++++++++++++++++',that.data.orderFormId);
          wx.cloud.callFunction({
            // 云函数名称
          name: 'shouhuo3',
                // 传给云函数的参数
          data: {
            id:that.data.orderFormId,
            status:'已接单',
            isstatus:true,
            Takefood:false
       
          },
      success: function (res) {
        console.log('修改成功',res);
        that.setData({
          saledata:[]
        })
        that.saleShow()
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
function formatDate3(time){
  var date = new Date(time);

  var year = date.getFullYear(),
      month = date.getMonth()+1,//月份是从0开始的
      day = date.getDate();
 
  var newTime = year + '-' +
      (month < 10? '0' + month : month) + '-' +
      (day < 10? '0' + day : day) 
  

  return newTime;
};