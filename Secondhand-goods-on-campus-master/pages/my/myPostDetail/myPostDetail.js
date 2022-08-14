const db = wx.cloud.database()
const App = getApp()
Page({
  data: {
    orderFormId:'', //获取数据id
    _openid:'',
    goodsDetailInf:{},
    imageArr:[],
    src:"",
    postGoods:true,
    postThing:false,
    postJob:false,
    ptjobDetailInf:{},
    jobDetailInf:{},
    modpostGoods:false,
    modPostThing:false,
    modPostJob:false,
    isStatus:false,
    // 修改百货信息
    GoodsName:'',
    GoodsCampus: ["大东关校区", "坞城校区","东山校区"],
    GoodsCampusIndex:0,
    GoodsConditions:["全新", "几乎全新", "九成新", "八成新", "七成新", "六成新", "五成新", "五成新以下"],
    GoodsConditionsIndex:0, 
    GoodsPrice:0,
    GoodsRemark:'',
    GoodsType:['二手书本','二手物品'],
    GoodsTypeIndex:0,
    GoodsWay:'',
    imgArr:[],
    video:false,
    video1:false,
    modimgList:[],
    modsrc: "",
    videoArr:'',
    srcPath:"",
    imagePathArray: [],
    conmodsrc: "",
    conmodimgList:[],
    contactmodimgList:[],
    contacymodsrc:[],
    //跑腿发布的数据
    ptjobConditions:[],
    ptjobCampus: ["大东关校区", "坞城校区","东山校区"], //6
    ptplaceSelect:["令德餐厅","文赢餐厅","文化餐厅"],
    ptplaceSelectIndex:0,
    ptjobCampusIndex: 0,
    ptjobConditionIndex: 0,
    ptjobName:'',
    ptjobPrice:0,
    ptservePrice:0,
    ptjobTime: '',
    ptjobPhoneNumber:'',
    ptjobPlace: '',
    ptjobPrice:'',
    ptjobRequir: '',
    ptjobSalary: '',
    ptjobWay: '',
    ptjobDescribe: '',
    buttonLoadingThing: false,

    //兼职信息数据
    jobName: '',
    jobType:[],
    jobTypeIndex:0,
    postJobName:'',
    jobTime: '',
    jobPlace: '',
    jobRequir: '',
    jobSalary: '',
    jobWay: '',
    jobDescribe: '',
    // buttonLoadingJob: false,

  },

  onLoad: function (options) {
    var that=this
    console.log("options",options.orderFormId)
    console.log("options",options.Index)
    that.setData({
      orderFormId: options.orderFormId,
      Index:Number(options.Index)
    })
    App.getopenid(res => {
      console.log("write cb res", res)
      this.setData({
        _openid: res
      })
    })
    if(options.Index==0){
      that.setData({
        postGoods:true,
        postThing:false,
        postJob:false
      })
      that.goodsdetail(that.data.orderFormId)
      /* that.GoodsType() */
    }else if(options.Index==1){
      that.setData({
        postGoods:false,
        postThing:true,
        postJob:false
      })
      that.ptjobdetail(that.data.orderFormId)
      that.ptjobType()
    }else{
      that.setData({
        postGoods:false,
        postThing:false,
        postJob:true
      })
      that.jobdetail(that.data.orderFormId)
      that.jobtype()
    }
   
  },
/*   GoodsType(){
    var that=this
    db.collection("categoryDetail").get({
      success(res) {
        console.log("数据库获取成功", res)
        that.setData({
          GoodsType:res.data[0].Detail,
        })
        console.log("GoodsType",that.data.GoodsType)
      },
      fail(res) {
        console.log("数据库获取失败", res);
      }
    })
  }, */
  ptjobType(){
    var that=this
    db.collection("categoryDetail").get({
      success(res) {
        console.log("数据库获取成功", res)
        that.setData({
          ptjobConditions:res.data[2].Detail,
        })
      },
      fail(res) {
        console.log("数据库获取失败", res);
      }
    })
  },
  jobtype(){
    var that=this
    db.collection("categoryDetail").get({
      success(res) {
        console.log("数据库获取成功", res)
        that.setData({
          jobType: res.data[1].Detail,
        })
        console.log("jobType",that.data.jobType)
      },
      fail(res) {
        console.log("数据库获取失败", res);
      }
    })
  },
  previewImg: function (e) {
    console.log("index",e.currentTarget.dataset.index);
    let index = e.currentTarget.dataset.index;
    let that = this;
    wx.previewImage({
      current: that.data.imgList[index],
      urls: that.data.imgList
    })
  },
  goodsdetail(id){
    let that = this;
    db.collection("wxGoodsPost").doc(id).get({
      success(res){ 
       console.log("数据获取成功啦",res);
        that.setData({
          goodsDetailInf: res.data,
          imgList:res.data.imgArr,
          src:res.data.videoArr
        })
        console.log("goodsDetailInf",that.data.goodsDetailInf);
      },
      fail(err){
        console.log("数据获取失败", err);
      }
    })
  },
  ptjobdetail(id){
    let that = this;
    db.collection("paotuiDatas").doc(id).get({
      success(res){ 
       console.log("数据获取成功",res);
        that.setData({
          ptjobDetailInf: res.data,
        })
      },
      fail(err){
        console.log("数据获取失败", err);
      }
    })
  },
  jobdetail(id){
    let that = this;
    db.collection("wxjobpost").doc(id).get({
      success(res){ 
       console.log("数据获取成功",res);
        that.setData({
          jobDetailInf: res.data,
        })
      },
      fail(err){
        console.log("数据获取失败", err);
      }
    })
  },
  onShow:function(){
  
  },

  onPullDownRefresh: function () {
    wx.setNavigationBarTitle({
      title: '我的发布'
    });
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标
    setTimeout(function () {
      wx.stopPullDownRefresh(); //停止加载
      wx.hideNavigationBarLoading(); //隐藏加载icon
    }, 2000)

  },

  onReachBottom: function () {
  },
  _handleMod(){
    var that = this;
    if(that.data.Index==0){
      if(that.data.goodsDetailInf.status=='已售'){
        wx.showToast({
          title: '您的商品已售，无法修改详情',
          icon: "none",
          duration: 1000
        })
      }else{
        that.setData({
          modpostGoods:true,
          modPostJob:false,
          modPostThing:false,
          postGoods:false,
          postThing:false,
          postJob:false
        });
        that.modgoodsDetail(that.data.orderFormId)
      }
    }else if(that.data.Index==1){
  
      if(that.data.ptjobDetailInf.status=='已接单'){
        wx.showToast({
          title: '您的商品已售，无法修改详情',
          icon: "none",
          duration: 1000
        })
      }else{
        that.setData({
          modpostGoods:false,
          modPostJob:false,
          modPostThing:true,
          postGoods:false,
          postThing:false,
          postJob:false
        });
        that.modptjobDetail(that.data.orderFormId)
      }
    }else{
      if(that.data.jobDetailInf.status=='已售'){
        wx.showToast({
          title: '您的商品已售，无法修改详情',
          icon: "none",
          duration: 1000
        })
      }else{
        that.setData({
          modpostGoods:false,
          modPostJob:true,
          modPostThing:false,
          postGoods:false,
          postThing:false,
          postJob:false
        });
        that.modJobDetail(that.data.orderFormId)
      } 
    }
    

  },
  modgoodsDetail(id){
    let that = this;
    console.log("执行到了",id)
    db.collection("wxGoodsPost").doc(id).get({
      success(res){ 
        that.setData({
          GoodsName:res.data.GoodsName,
          GoodsConditionsIndex:res.data.GoodsConditionsIndex,
          GoodsPrice:res.data.GoodsPrice,
          GoodsRemark:res.data.GoodsRemark,
          GoodsTypeIndex:res.data.GoodsTypeIndex,
          GoodsCampusIndex:res.data.GoodsCampusIndex,
          GoodsWay:res.data.GoodsWay,
          modimgList:res.data.imgArr,
          modsrc: res.data.videoArr,
          isStatus:res.data.isStatus
        })
        that.setData({
          contactmodimgList: that.data.modimgList
        })
        that.setData({
          contactmodsrc: that.data.modsrc
        })
        if(that.data.modsrc.length==0){
          that.setData({
            video:false,
            video1:true
          })
        }else{
          that.setData({
            video:true,
            video1:false
          })
        }
        console.log("res.data.GoodsTypeIndex",res.data.GoodsTypeIndex);
        console.log("modimgList",res.data.imgArr);
        console.log("modsrc",res.data.imgArr);
        console.log("modimgListthat",that.data.contactmodimgList);
        console.log("modsrcthat",that.data.modsrc);
      },
      fail(err){
        console.log("数据获取失败", err);
      }
    })
  },
  modptjobDetail(id){
    let that = this;
    console.log("执行到了",id)
    db.collection("paotuiDatas").doc(id).get({
      success(res){ 
        console.log(res.data);
        that.setData({
        ptjobName:res.data.ptjobName,
        ptjobPrice:res.data.ptjobPrice,
        ptservePrice:res.data.ptservePrice,
        ptjobCampusIndex:res.data.ptjobCampusIndex,
        ptjobPhoneNumber:res.data.ptjobPhoneNumber,
        ptjobPlace:res.data.ptjobPlace,
        ptjobTime:res.data.ptjobTime,
        ptjobDescribe:res.data.ptjobDescribe,
        ptjobConditionIndex:res.data.ptjobConditionIndex,
        ptplaceSelectIndex:res.data.ptplaceSelectIndex,
        isStatus:res.data.isStatus
        })
        console.log('that.data.ptjobConditionIndex',that.data.ptjobConditionIndex)
        if(that.data.ptjobConditionIndex== 0){
          that.setData({
            ptplaceSelect:["令德餐厅","文赢餐厅","文化餐厅"],
            ptjobConditionIndex:0
          })
        }
        else if(that.data.ptjobConditionIndex== 1){
          that.setData({
            ptplaceSelect:["烘培屋","好利来","大熊烘培"],
            ptjobConditionIndex:1
          })
      
        }
        else if(that.data.ptjobConditionIndex == 4){
          that.setData({
            ptplaceSelect:["中通快递","文赢菜鸟驿站","令德菜鸟驿站"],
            ptjobConditionIndex:4
          })
        }else {
          that.setData({
            ptplaceSelect:["全校"],
          })
        }
      },
      fail(err){
        console.log("数据获取失败", err);
      }
    })
  },

  modJobDetail(id){
    let that = this;
    console.log("执行到了",id)
    db.collection("wxjobpost").doc(id).get({
      success(res){ 
        console.log('res',res)
        console.log(res.data.jobType)
        console.log(res.data.jobTypeIndex)
        that.setData({
          jobName:res.data.jobName,
          jobTypeIndex: res.data.jobTypeIndex,
          jobTime:res.data.jobTime,
          jobPlace:res.data.jobPlace,
          jobRequir: res.data.jobRequir,
          jobSalary: res.data.jobSalary,
          jobWay: res.data.jobWay,
          postJobName:res.data.postJobName,
          jobDescribe: res.data.jobDescribe,
          isStatus:res.data.isStatus
        })
        console.log('job',that.data.jobType)
        
      },
      fail(err){
        console.log("数据获取失败", err);
      }
    })
  },
   //响应事件
    // 兼职
   jobNameinput: function(e) { //兼职名称
    this.setData({
      jobName: e.detail.value
    })
  },
  bindJobTimeInput: function(e) { //兼职时间
    this.setData({
      jobTime: e.detail.value
    })
  },
  bindJobPlaceInput: function(e) { //兼职地点
    this.setData({
      jobPlace: e.detail.value
    })
  },
  bindJobRequirInput: function(e) { //兼职要求
    this.setData({
      jobRequir: e.detail.value
    })
  },
  bindjobSalaryInput: function(e) { //兼职工资
    this.setData({
      jobSalary: e.detail.value
    })
  },
  bindJobWayInput: function(e) { //兼职联系方式
    this.setData({
      jobWay: e.detail.value
    })
  },
  jobDescribeInput: function(e) { //兼职描述
    this.setData({
      jobDescribe: e.detail.value
    })
  },
  bindjobTypeChange: function(e) { //兼职类型
    console.log(e.detail.value)
    this.setData({
      jobTypeIndex: e.detail.value
    })
  },
//跑腿
ptjobinput: function(e) { //跑腿需求
  this.setData({
    ptjobName: e.detail.value
  })

},
ptjobcatagoryInput:function (e) {  //跑腿类型
  this.setData({
    ptjobConditionIndex:e.detail.value,
  })
  if(this.data.ptjobConditionIndex == 0){

    this.setData({
      ptplaceSelect:["令德餐厅","文赢餐厅","文化餐厅"],
      ptjobConditionIndex:0
    })
  }
  else if(this.data.ptjobConditionIndex == 1){
    this.setData({
      ptplaceSelect:["烘培屋","好利来","大熊烘培"],
      ptjobConditionIndex:1
    })

  }
  else if(this.data.ptjobConditionIndex== 4){
    this.setData({
      ptplaceSelect:["中通快递","文赢菜鸟驿站","令德菜鸟驿站"],
      ptjobConditionIndex:4
    })
  }else {
    this.setData({
      ptplaceSelect:["全校"],
    })
  }
  
  
},

bindjobPriceInput:function (e) {    //需求商品费用
  var money;
  if (/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value)) { //正则验证，金额小数点后不能大于两位数字
    money = e.detail.value;
  } else {
    money = e.detail.value.substring(0, e.detail.value.length - 1);
  }
  this.setData({
    ptjobPrice:money
  })

  
},
ptjobselectInput:function (e) {    //商户选择
 
  this.setData({
    ptplaceSelectIndex:e.detail.value
  })
  console.log('***************')
  console.log(this.data.ptplaceSelectIndex)

  
},
ptjobserveInput: function(e) { //商品价格
  var money;
  if (/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value)) { //正则验证，金额小数点后不能大于两位数字
    money = e.detail.value;
  } else {
    money = e.detail.value.substring(0, e.detail.value.length - 1);
  }
  this.setData({
    ptservePrice:money
  })

},

ptjobschoolInput:function (e) {    //校区
  this.setData({
    ptjobCampusIndex: e.detail.value
  })
  
},
ptjobPhoneNumberInput: function(e) { //联系方式
  this.setData({
    ptjobPhoneNumber: e.detail.value,
  })
},
ptjobTime: function(e) { // 送达时间时间
  this.setData({
    ptjobTime: e.detail.value
  })
},
ptjobPlace: function(e) { //送达地址地点
  this.setData({
    ptjobPlace: e.detail.value
  })
},
ptjobDescribeInput: function(e) { //备注信息
  this.setData({
    ptjobDescribe: e.detail.value
  })
},
bindpostNameInput: function(e) { 
  this.setData({
   ptpostName: e.detail.value
  })
},
 
// 物品
  bindstatus: function(e) {
    this.setData({
      isStatus: e.detail.value
    })
  },
  bindGoodsNameInput: function(e) { 
    this.setData({
      GoodsName: e.detail.value
    })
  },
                
  bindGoodsConditionsChange: function(e) { 
    this.setData({
      GoodsConditionsIndex: e.detail.value
    })
  },
  bindGoodsPriceInput: function(e) { //商品价格
    var money;
    if (/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value)) { //正则验证，金额小数点后不能大于两位数字
      money = e.detail.value;
    } else {
      money = e.detail.value.substring(0, e.detail.value.length - 1);
    }
    this.setData({
      GoodsPrice: money,
    })
  },
  bindGoodsCampusChange: function(e) { //校区
    this.setData({
      GoodsCampusIndex: e.detail.value
    })
   
  },
  bindGoodsWayInput: function(e) { //联系方式
    this.setData({
      GoodsWay: e.detail.value
    })
  },
  bindGoodsTypeChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      GoodsTypeIndex: e.detail.value
    })
  },
  bindGoodsRemarkInput: function(e) {
    this.setData({
      GoodsRemark: e.detail.value
    })
  },
  // 书本发布图片  物品  
      chooseSource: function () {
        var that = this;
        wx.showActionSheet({
          itemList: ["拍照", "从相册中选择"],
          itemColor: "#000000",
          success: function (res) {
            if (!res.cancel) {
              if (res.tapIndex == 0) {
                that.imgWShow("camera")        //拍照
              } else if (res.tapIndex == 1) {
                that.imgWShow("album")      //相册
              }
            }
          }
        })
      },
      // 点击调用手机相册/拍照
      imgWShow: function (type) {
        var that = this;
        let len = 0;
        if (that.data.contactmodimgList != null) {
          len = that.data.contactmodimgList.length
        }   //获取当前已有的图片
        wx.chooseImage({
          count: 9 - len,     //最多还能上传的图片数,这里最多可以上传5张
          sizeType: ['original', 'compressed'],        //可以指定是原图还是压缩图,默认二者都有
          sourceType: [type],             //可以指定来源是相册还是相机, 默认二者都有
          success: function (res) {
            wx.showToast({
              title: '正在上传...',
              icon: "loading",
              mask: true,
              duration: 1000
            })
            var conmodimgList = res.tempFilePaths
            conmodimgList.forEach(items => {
             console.log(items);
           if(items && items.size > 1 * (1024 * 1024)){
             wx.showToast({
               icon: 'none',
               title: '上传的图片超过1M,禁止用户上传',
               duration: 4000
             })
           }else{
             wx.cloud.callFunction({ 
               name: 'msgSCImg',
                 data: {
                   img: items // 传入要检测的值
                 }
               })
               .then(res => {
                  console.log(res);
                  let { errCode } = res.result.data;
                  switch(errCode) {
                    case 87014:
                     console.log('内容违规')
                     wx.showToast({
                       title: '图片含有违规内容',
                       icon: 'none'
                     })
                      console.log('内容违规')
                      break;
                    case 0:
                     console.log('内容OK')


                             // 返回选定照片的本地文件路径列表,tempFilePaths可以作为img标签的scr属性显示图片

                    let tempFilePathsImg = that.data.conmodimgList
                    // 获取当前已上传的图片的数组
                    var tempFilePathsImgs = tempFilePathsImg.concat(items)
                    that.setData({
                      conmodimgList: tempFilePathsImgs
                    })
                    console.log("原来图",that.data.modimgList)
                    console.log("现在图",that.data.conmodimgList)
                    var modimgList1=that.data.modimgList
                    that.setData({
                      contactmodimgList: modimgList1.concat(that.data.conmodimgList)
                    })
                      break;
                    default:
                      break;
                  }
               })
               .catch(err => {
                  console.error(err);
               })
           }
          })
            // wx.hideLoading()
            
          },fail: function () {
            wx.showToast({
              title: '图片上传失败',
              icon: 'none'
            })
            return;
          }
        })
      },
// 预览图片
previewImg: function (e) {
  let index = e.currentTarget.dataset.index;
  console.log("index2",index)
  console.log("index3", e)
  let that = this;
  wx.previewImage({
    current: that.data.modimgList[index],
    urls: that.data.modimgList
  })
},
conmodpreviewImg: function (e) {
  console.log("index4", e)
  let index = e.currentTarget.dataset.index;
  console.log("index1", index)
  let that = this;
  wx.previewImage({
    current: that.data.conmodimgList[index],
    urls: that.data.conmodimgList
  })
},
  /**
   * 点击删除图片  物品
   */
  deleteImg: function (e) {
    var that = this;
    var modimgList = that.data.modimgList;
    var index = e.currentTarget.dataset.index;  
    console.log('index',index)    //获取当前点击图片下标
    wx.showModal({
      title: '提示',
      content: '确认要删除该图片吗?',
      success: function (res) {
        if (res.confirm) {
          console.log("点击确定了")
          modimgList.splice(index, 1);
        } else if (res.cancel) {
          console.log("点击取消了");
          return false
        }
        that.setData({
          modimgList
        })
        that.setData({
          contactmodimgList: that.data.modimgList.concat(that.data.conmodimgList)
        })
      }
    })
  },
  condeleteImg: function (e) {
    var that = this;
    var conmodimgList = that.data.conmodimgList;
    var index = e.currentTarget.dataset.index;  
    console.log('index',index)    //获取当前点击图片下标
    wx.showModal({
      title: '提示',
      content: '确认要删除该图片吗?',
      success: function (res) {
        if (res.confirm) {
          console.log("点击确定了")
          conmodimgList.splice(index, 1);
        } else if (res.cancel) {
          console.log("点击取消了");
          return false
        }
        that.setData({
          conmodimgList
        })
        that.setData({
          contactmodimgList: that.data.modimgList.concat(that.data.conmodimgList)
        })
      }
    })
  },


  // 物品发布上传视频
 /**
   * 选择视频
   */
/**
* 选择视频
*/
chooseVideo: function() {
  var that = this;
  wx.chooseVideo({
    sourceType: ['album','camera'],
    maxDuration: 30,
    camera: 'back',
    success: function(res) {
      console.log("视频上传成功",res)
      that.setData({
        conmodsrc: res.tempFilePath,
      })
      that.setData({
        contactmodsrc: that.data.conmodsrc
      })
      
      
    },
    fail:function(err) {
      console.log("视频上传失败",err)
      
    },
  })
},
// 点击删除视频
deleteVideo:function (e) {
var that = this;
wx.showModal({
  title: '提示',
  content: '确认要删除该视频吗?',
  success: function (res) {
    if (res.confirm) {
      console.log("点击确定了")
      that.setData({
        modsrc:''
      })
      that.setData({
        contactmodsrc: that.data.modsrc
      })
      that.setData({
        video:false,
        video1:true
      })
    } else if (res.cancel) {
      console.log("点击取消了");
      return false
    }
    
  }
})
},
condeleteVideo:function (e) {
var that = this;
wx.showModal({
  title: '提示',
  content: '确认要删除该视频吗?',
  success: function (res) {
    if (res.confirm) {
      console.log("点击确定了")
      that.setData({
        conmodsrc:''
      })
      that.setData({
        contactmodsrc: that.data.modsrc
      })
    } else if (res.cancel) {
      console.log("点击取消了");
      return false
    }
    
  }
})
},
  // 确定修改百货发布按钮
  bindSubmitgood: function() {
    var that = this;
     console.log('that.data.GoodsName',that.data.GoodsName)
     console.log('that.data.GoodsPrice',that.data.GoodsPrice)
     console.log('that.data.GoodsWay',that.data.GoodsWay)
    if(that.data.GoodsName == ''||  that.data.GoodsPrice==''||that.data.GoodsWay == ''){
      wx.showToast({
        title: '您还有信息未填',
        icon: 'none',
        duration: 1500
      })
      return;
    }else{
      var msgSC=that.data.GoodsName+that.data.GoodsWay+that.data.GoodsRemark 
      console.log('msgSC',msgSC)
      wx.cloud.init();
      wx.cloud.callFunction({
        name: 'msgSC',
        data: {
          text: msgSC  
        }
      }).then(res => {
        if (res.result.code == "200") {
          console.log('检测通过')
            that._ifUploadgood()
        } else {
          wx.showToast({
            title: '包含敏感字，禁止发布',
            icon: 'none',
            duration: 3000
          })
        }
      })
    } 
  },
  //上传物品图片视频到数据库以及上传
      _ifUploadgood: function () {
        var that = this;
        console.log('openid',that.data._openid)
        var GoodsName=that.data.GoodsName;
        console.log('that.data.GoodsPrice',that.data.GoodsPrice)
        console.log('GoodsPrice',parseInt(that.data.GoodsPrice))
        var GoodsPrice=Number(that.data.GoodsPrice);
        var GoodsTypeIndex=Number(that.data.GoodsTypeIndex);
        var GoodsWay=that.data.GoodsWay;
        var GoodsRemark = that.data.GoodsRemark || '无备注或描述';
        var GoodsCampusIndex = Number(that.data.GoodsCampusIndex);
        var GoodsConditionsIndex = Number(that.data.GoodsConditionsIndex);
        var GoodsCampus = that.data.GoodsCampus[GoodsCampusIndex];
        var GoodsConditions = that.data.GoodsConditions[GoodsConditionsIndex];
        var GoodsType = that.data.GoodsType[GoodsTypeIndex];
        var isStatus1 = that.data.isStatus;
        if(isStatus1){
          var Status="已售"
        }else{
          var Status="未售"
        }
        var imgList0=that.data.modimgList;
        var src0=that.data.modsrc;
        var imgList1=that.data.conmodimgList;
        var src1=that.data.conmodsrc;
        wx.showToast({
            title: '上传中',
            icon: 'succes',
            duration: 2500,
            mask: true
        })
        wx.showLoading({
          title: '上传中...',
          });
        var promiseArr=[]
        if(imgList1.length==0){
            if(src1.length==0){
              that.updategood(GoodsName,GoodsType,GoodsTypeIndex,GoodsConditions,GoodsConditionsIndex,GoodsCampus,GoodsCampusIndex,GoodsPrice,GoodsWay,GoodsRemark,isStatus1,Status,imgList0,src0)
            }else{
              wx.cloud.uploadFile({
                cloudPath: `book/${that.data._openid}/${new Date().getTime()}.mp4`,
                filePath:src1,
                sizeType : ['compressed'],
                success: r => {
                  console.log('视频上传',r.fileID);
                  that.setData({
                    srcPath:r.fileID
                  })
                  console.log('执行到了src',that.data.srcPath);
                  that.updategood(GoodsName,GoodsType,GoodsTypeIndex,GoodsConditions,GoodsConditionsIndex,GoodsCampus,GoodsCampusIndex,GoodsPrice,GoodsWay,GoodsRemark,isStatus1,Status,imgList0,that.data.srcPath)
                },
                fail: e => {
                   console.log('上传视频失败：', e)
                  wx.showToast({
                    icon: 'none',
                    title: '上传失败',
                  })
                },
              })
            }
        }else{
          if(src1.length==0){
            for(let i = 0; i < imgList1.length; i++){
              console.log('图片',imgList1)
              console.log('openid',that.data._openid)
              const cloudPath = `book/${that.data._openid}/${new Date().getTime()}-${i}${imgList1[i].match(/\.[^.]+?$/)[0]}`
              var imagePath = imgList1[i]
              promiseArr.push(new Promise((reslove,reject)=>{
                wx.cloud.uploadFile({
                  cloudPath:cloudPath,
                  filePath: imagePath,
                  sizeType : ['compressed']
                }).then(rest=>{
                  console.log('上传图片成功：', rest)
                  that.setData({
                    imagePathArray: that.data.imagePathArray.concat(rest.fileID)
                  })
                  console.log('imagePathArray',that.data.imagePathArray)
                  reslove()
                }).catch(e => {
                  console.error('上传图片失败：', e)
                    wx.showToast({
                      icon: 'none',
                      title: '上传失败',
                    })
                  })
              }))
            }
            Promise.all(promiseArr).then(res=>{
              that.updategood(GoodsName,GoodsType,GoodsTypeIndex,GoodsConditions,GoodsConditionsIndex,GoodsCampus,GoodsCampusIndex,GoodsPrice,GoodsWay,GoodsRemark,isStatus1,Status,imgList0.concat(that.data.imagePathArray),src0)
              
            })
          }else{
            for(let i = 0; i < imgList1.length; i++){
              console.log('图片',imgList1)
              console.log('openid',that.data._openid)
              const cloudPath = `book/${that.data._openid}/${new Date().getTime()}-${i}${imgList1[i].match(/\.[^.]+?$/)[0]}`
              var imagePath = imgList1[i]
              promiseArr.push(new Promise((reslove,reject)=>{
                wx.cloud.uploadFile({
                  cloudPath:cloudPath,
                  filePath: imagePath,
                  sizeType : ['compressed']
                }).then(rest=>{
                  console.log('上传图片成功：', rest)
                  that.setData({
                    imagePathArray: that.data.imagePathArray.concat(rest.fileID)
                  })
                  reslove()
                }).catch(e => {
                  console.error('上传图片失败：', e)
                    wx.showToast({
                      icon: 'none',
                      title: '上传失败',
                    })
                  })
              }))
            }
            Promise.all(promiseArr).then(res=>{
              wx.cloud.uploadFile({
                cloudPath: `book/${that.data._openid}/${new Date().getTime()}.mp4`,
                filePath:src1,
                sizeType : ['compressed'],
                success: r => {
                  console.log('视频上传',r.fileID);
                  that.setData({
                    srcPath:r.fileID
                  })
                  console.log('执行到了src',that.data.srcPath);
                  that.updategood(GoodsName,GoodsType,GoodsTypeIndex,GoodsConditions,GoodsConditionsIndex,GoodsCampus,GoodsCampusIndex,GoodsPrice,GoodsWay,GoodsRemark,isStatus1,Status,imgList0.concat(that.data.imagePathArray),that.data.srcPath)
                },
                fail: e => {
                   console.log('上传视频失败：', e)
                  wx.showToast({
                    icon: 'none',
                    title: '上传失败',
                  })
                },
              })
              
            })
          }
          
        }
        
 
      },
  // 修改百货信息到数据库
  updategood(GoodsName,GoodsType,GoodsTypeIndex,GoodsConditions,GoodsConditionsIndex,GoodsCampus,GoodsCampusIndex,GoodsPrice,GoodsWay,GoodsRemark,isStatus,Status,imagePathArray,srcPath){
    var that=this
    db.collection('wxGoodsPost').doc(that.data.orderFormId).update({
      data: {
        GoodsName:GoodsName,
        GoodsType:GoodsType,
        GoodsTypeIndex:GoodsTypeIndex,
        GoodsConditions:GoodsConditions,
        GoodsConditionsIndex:GoodsConditionsIndex,
        GoodsCampus:GoodsCampus,
        GoodsCampusIndex:GoodsCampusIndex,
        GoodsPrice:GoodsPrice,
        GoodsWay:GoodsWay,
        GoodsRemark:GoodsRemark,
        isStatus:isStatus,
        status:Status,
        imgArr:imagePathArray, //图片
        videoArr:srcPath, //视频
        time:formatDate2(new Date().getTime()),
        Time:new Date().getTime(),
      },
      success: res => {
        console.log("修改据库成功", res)
        wx.hideLoading()
        wx.showToast({
          title: '修改成功',
          icon: 'succes',
          duration: 2500,
          mask: true
        }) 
        wx.redirectTo({
          url: '/pages/my/myPostDetail/myPostDetail?orderFormId='+that.data.orderFormId+'&Index='+"0",
        })
      },
      fail: err => {
        console.log("添加数据库失败", err)
        wx.showToast({
          title: '修改失败',
          icon: 'loading',
          duration: 2000
        })
        wx.switchTab({
          url: '/pages/my/myPostDetail/myPostDetail?orderFormId='+that.data.orderFormId+'&Index='+"0",
        })
      }

    })
  },
  //确定修改跑腿的响应事件
    bindSubmitptjob: function(){
      var that = this;
    if(that.data.ptjobName == ''||that.data.ptjobPhoneNumber ==''|| that.data.ptjobPlace == ''|| that.data.ptjobTime ==''){
      wx.showToast({
        title: '您还有信息未填',
        icon: 'none',
        duration: 1500
      })
      return;
    }else{
      var msgSC=that.data.ptjobName+that.data.ptjobPrice+that.data.ptservePrice+ that.data.ptjobPhoneNumber+that.data.ptjobPlace+that.data.ptjobTime+that.data.ptjobDescribe
      console.log('msgSC',msgSC)
      wx.cloud.init();
      wx.cloud.callFunction({
        name: 'msgSC',
        data: {
          text: msgSC  
        }
      }).then(res => {
        if (res.result.code == "200") {
          console.log('检测通过')
         that._ifUploadptjob()   
        } else {
          wx.showToast({
            title: '包含敏感字，禁止发布',
            icon: 'none',
            duration: 3000
          })
        }
      })

      
    } 
      
        
    },
    //上传跑腿到数据库以及上传
    _ifUploadptjob: function () {
      var that = this;
      var ptjobConditionIndex = Number(that.data.ptjobConditionIndex);
      var ptType = that.data.ptjobConditions[ptjobConditionIndex];
      var ptplaceSelectIndex =Number(that.data.ptplaceSelectIndex);
      var ptplaceSelect = that.data.ptplaceSelect[ptplaceSelectIndex];
      var ptjobName = that.data.ptjobName; //需求介绍
      var ptjobPrice = Number(that.data.ptjobPrice); //价格
      var ptservePrice = Number(that.data.ptservePrice); // 服务价格
      var ptjobCampusIndex = Number(that.data.ptjobCampusIndex);// 校区
      var ptjobCampus = that.data.ptjobCampus[ptjobCampusIndex];// 校区
      var ptjobPhoneNumber = that.data.ptjobPhoneNumber; //联系电话
      var ptjobPlace = that.data.ptjobPlace; //送达地点
      var ptjobTime = that.data.ptjobTime;//送达时间
      var ptjobDescribe = that.data.ptjobDescribe; //备注信息
      var isStatus1 = that.data.isStatus;
      if(isStatus1){
        var Status="已接单"
      }else{
        var Status="未接单"
      }
      console.log('openid',that.data._openid)
      wx.showToast({
          title: '上传中',
          icon: 'succes',
          duration: 2500,
          mask: true
      })
      wx.showLoading({
        title: '上传中...',
        });
        that.updateptjob(ptjobName,ptservePrice,ptjobDescribe,ptjobCampusIndex,ptjobCampus,ptjobPhoneNumber,ptType,ptjobPlace,ptjobTime,ptjobPrice,ptplaceSelect,ptjobConditionIndex,ptplaceSelectIndex,isStatus1,Status) 
    },
    // 添加跑腿信息到数据库
    updateptjob(ptjobName,ptservePrice,ptjobDescribe,ptjobCampusIndex,ptjobCampus,ptjobPhoneNumber,ptType,ptjobPlace,ptjobTime,ptjobPrice,ptplaceSelect,ptjobConditionIndex,ptplaceSelectIndex,isStatus,status){
      var that=this
    db.collection('paotuiDatas').doc(that.data.orderFormId).update({
    data: {
      ptjobName: ptjobName,
    ptservePrice:ptservePrice,
    ptjobDescribe: ptjobDescribe,
    ptjobCampusIndex:ptjobCampusIndex,
    ptjobCampus:ptjobCampus,
    ptjobPhoneNumber:ptjobPhoneNumber,
    ptType:ptType,
    ptjobPlace: ptjobPlace,
    ptjobTime: ptjobTime,
    ptjobPrice:ptjobPrice,
    ptplaceSelect:ptplaceSelect,
    ptjobConditionIndex:ptjobConditionIndex,
    ptplaceSelectIndex:ptplaceSelectIndex,
    isStatus:isStatus,
    status:status,
    time:formatDate2(new Date().getTime()),
    Time:new Date().getTime(),
    
    },
    success: res => {
      console.log("添加数据库成功", res)
      wx.hideLoading()
      wx.showToast({
        title: '修改成功',
        icon: 'succes',
        duration: 2500,
        mask: true
      }) 
      wx.redirectTo({
        url: '/pages/my/myPostDetail/myPostDetail?orderFormId='+that.data.orderFormId+'&Index='+"1",
      })
    },
    fail: err => {
      console.log("添加数据库失败", err)
      wx.showToast({
        title: '修改失败',
        icon: 'loading',
        duration: 2000
      })
      wx.switchTab({
        url: '/pages/my/myPostDetail/myPostDetail?orderFormId='+that.data.orderFormId+'&Index='+"1",
      })
    }
    })
    },
  //发布兼职的响应事件
    bindSubmitJob: function() {
      var that = this;
      if(that.data.jobName == ''||that.data.jobTime == ''||that.data.jobPlace == ''||that.data.jobRequir == ''||that.data.jobSalary == '' ||that.data.jobWay ==''||that.data.jobDescribe == ''){
        wx.showToast({
          title: '您还有信息未填',
          icon: 'none',
          duration: 1500
        })
        return;
      }else{
        var msgSC=that.data.jobName+that.data.jobTime+that.data.jobPlace+ that.data.jobRequir+that.data.jobSalary+that.data.jobWay+that.data.jobDescribe
        console.log('msgSC',msgSC)
        wx.cloud.init();
        wx.cloud.callFunction({
          name: 'msgSC',
          data: {
            text: msgSC  
          }
        }).then(res => {
          if (res.result.code == "200") {
            console.log('检测通过')
            that._ifUploadJob() 
          } else {
            wx.showToast({
              title: '包含敏感字，禁止发布',
              icon: 'none',
              duration: 3000
            })
          }
        })
      }
      
    },
    //上传兼职
    _ifUploadJob: function () {
      var that = this;
      console.log('openid',that.data._openid)
      var jobName = that.data.jobName; //工作名称
      var jobDescribe = that.data.jobDescribe; //职位描述
      var jobWay = that.data.jobWay; //联系电话
      var jobSalary = that.data.jobSalary; //资薪福利
      var jobPlace = that.data.jobPlace; //工作地点
      var jobTime = that.data.jobTime; //工作时间
      var jobRequir = that.data.jobRequir; //人员要求
      var nickName1 = that.data.nickname;
      var isStatus1=that.data.isStatus;
      var postJobName=that.data.postJobName;
      var jobTypeIndex = Number(that.data.jobTypeIndex);
      var jobType = that.data.jobType[jobTypeIndex];
      console.log('jobType',jobType)
      if(isStatus1){
        var Status="已售"
      }else{
        var Status="未售"
      }
      wx.showToast({
          title: '上传中',
          icon: 'succes',
          duration: 2500,
          mask: true
      })
      that.updateJob(jobName,jobDescribe,jobWay,jobSalary,jobPlace,jobTime,jobRequir,isStatus1,Status,postJobName,jobTypeIndex,jobType) 
    },
    // 添加兼职信息到数据库
    updateJob(jobName,jobDescribe,jobWay,jobSalary,jobPlace,jobTime,jobRequir,isStatus1,Status,postJobName,jobTypeIndex,jobType) {
      var that=this
    db.collection('wxjobpost').doc(that.data.orderFormId).update({
    data: {
      jobName: jobName,
      jobRequir: jobRequir,
      jobTime: jobTime,
      jobDescribe: jobDescribe,
      jobWay: jobWay,
      jobSalary: jobSalary,
      jobPlace: jobPlace,
      isStatus:isStatus1,
      status:Status,
      postJobName:postJobName,
      jobTypeIndex:jobTypeIndex,
      jobType:jobType,
      time:formatDate2(new Date().getTime()),
      Time:new Date().getTime(),
    },
    success: res => {
      console.log("添加数据库成功", res)
      wx.showToast({
        title: '修改成功',
        icon: 'succes',
        duration: 2500,
        mask: true
      }) 
      wx.redirectTo({
        url: '/pages/my/myPostDetail/myPostDetail?orderFormId='+that.data.orderFormId+'&Index='+"2",
      })
    },
    fail: err => {
      console.log("添加数据库失败", err)
      wx.showToast({
        title: '修改失败',
        icon: 'loading',
        duration: 2000
      })
      wx.switchTab({
        url: '/pages/my/myPostDetail/myPostDetail?orderFormId='+that.data.orderFormId+'&Index='+"2",
      })
    }
    })
    },
  deletePost () {
    var that=this
    var that = this;
    if(that.data.Index==0){
      that.setData({
        modpostGoods:false,
        modPostJob:false,
        modPostThing:false,
        postGoods:true,
        postThing:false,
        postJob:false
      });
      that.goodsdetail(that.data.orderFormId)
      that.removegoods(that.data.orderFormId)
    }else if(that.data.Index==1){
      that.setData({
        modpostGoods:false,
        modPostJob:false,
        modPostThing:false,
        postGoods:false,
        postThing:true,
        postJob:false
      });
      that.ptjobdetail(that.data.orderFormId)
      that.removeptjob(that.data.orderFormId)
    }else{
      that.setData({
        modpostGoods:false,
        modPostJob:false,
        modPostThing:false,
        postGoods:false,
        postThing:false,
        postJob:true
      });
      that.jobdetail(that.data.orderFormId)
      that.removeJob(that.data.orderFormId)
    }
   
  },
removegoods(id){
  var that=this
  wx.showModal({
    title: '操作提示',
    content: '确定要删除该发布？',
    success: function (res) {
      if (res.confirm) {
        db.collection("wxGoodsPost").where({
          _id:id,
        }).remove({
          success: function(res){
            console.log("删除成功",res)
            wx.redirectTo({
              url: '../myPost/myPost?goCurrtab='+Number(0),
            })
          }
        })
      }else{
        that.setData({
          modpostGoods:false,
          modPostJob:false,
          modPostThing:false,
          postGoods:true,
          postThing:false,
          postJob:false
        });
        that.goodsdetail(that.data.orderFormId)
      }
    }
  })
},
removeptjob(id){
  var that=this
  console.log(that.data.Index);
  wx.showModal({
    title: '操作提示',
    content: '确定要删除该发布？',
    success: function (res) {
      if (res.confirm) {
        //删除跑腿
        db.collection("paotuiDatas").where({
          _id:id,
        }).remove({
          success: function(res){
            console.log("删除成功",res)
            wx.redirectTo({
              url: '../myPost/myPost?goCurrtab='+Number(1),
            })
          }
        })
      }else{
        that.setData({
          modpostGoods:false,
          modPostJob:false,
          modPostThing:false,
          postGoods:false,
          postThing:true,
          postJob:false
        });
        that.goodsdetail(that.data.orderFormId)
      }
    }
  })
},
removeJob(id){
  var that=this
  wx.showModal({
    title: '操作提示',
    content: '确定要删除该发布？',
    success: function (res) {
      if (res.confirm) {
        //删除兼职
        db.collection("wxjobpost").where({
          _id:id,
        }).remove({
          success: function(res){
            console.log("删除成功",res)
            wx.redirectTo({
              url: '../myPost/myPost?goCurrtab='+Number(2),
            })
          }
        })
      }else{
        that.setData({
          modpostGoods:false,
          modPostJob:false,
          modPostThing:false,
          postGoods:false,
          postThing:false,
          postJob:true
        });
        that.jobdetail(that.data.orderFormId)
      }
    }
  })
},
})
function formatDate2(time){
  var date = new Date(time);

  var year = date.getFullYear(),
      month = date.getMonth()+1,//月份是从0开始的
      day = date.getDate(),
      hour = date.getHours(),
      min = date.getMinutes(),
      sec = date.getSeconds();
  var newTime = year + '-' +
      (month < 10? '0' + month : month) + '-' +
      (day < 10? '0' + day : day) + ' ' +
      (hour < 10? '0' + hour : hour) + ':' +
      (min < 10? '0' + min : min) + ':' +
      (sec < 10? '0' + sec : sec);

  return newTime;
};
