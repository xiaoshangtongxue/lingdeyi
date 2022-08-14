// const { fail } = require("assert")

const App = getApp()
const db = wx.cloud.database()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    _openid:'',
    nickname: '', //用户昵称 11
    pnoneNumber:'',
    //导航栏的数据
    postGoods: true,
    postJob: false,
    postErrand: false,
     //物品发布的数据
    GoodsWay: '', //用户联系方式
    GoodsName: '', //  物品名字 
    GoodsType:['二手书本','二手物品'],
    GoodsTypeIndex:0,
    GoodsConditions: ["全新", "几乎全新", "九成新", "八成新", "七成新", "六成新", "五成新", "五成新以下"], //成色
    GoodsConditionsIndex: 2, 
    GoodsCampus: ["坞城校区","东山校区","大东关校区", ], //校区
    GoodsCampusIndex: 0,
    GoodsPrice:'', //物品价格
    GoodsRemark: '', // 备注8
    imgList:[],
    src: "",
    srcPath:"",
    imagePathArray: [],
   

    //兼职信息数据
    jobName: '',
    jobType:[],
    jobTypeIndex:0,
    jobTime: '',
    jobPlace: '',
    jobRequir: '',
    jobSalary: '',
    jobWay: '',
    jobDescribe: '',

    //跑腿信息数据
    ptjobConditions: [],
    ptjobCampus: [ "坞城校区","东山校区","大东关校区"], //6
    ptplaceSelect:["令德餐厅","文赢餐厅","文化餐厅"],
    ptplaceSelectIndex:0,
    ptjobCampusIndex: 0,
    ptjobConditionIndex: 0,
    ptjobName: '',
    ptservePrice:'',
    ptjobTime: '',
    ptjobPhoneNumber:'',
    ptjobPlace: '',
    ptjobPrice:'',
    ptjobRequir: '',
    ptjobSalary: '',
    ptjobWay: '',
    ptpostJobName:"",
    ptjobDescribe: '',
    buttonLoadingJob: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {  
    console.log("222")
    App.getopenid(res => {
      console.log("write cb res", res)
      this.setData({
        _openid: res
      })
      this.register(res)
      console.log("openid0",res)
    })  
   
  },
  register(openid){
    var that=this
      db.collection('wxmember').where({
         _openid: openid
      }).get().then(res => {
        console.log("会员信息",res.data.length);
        if(res.data.length==0){
          console.log("123",res.data.length);
          wx.showModal({
            content: '您还未授权登录，是否登录',
            success(rest){
              if(rest.confirm){
                wx.navigateTo({
                  url: '/pages/login/startin',
                })
              }else if(rest.cancel){
                wx.switchTab({
                  url: '/pages/my/my',
                })
              }
            }
          })
        }else{
          that.setData({
            nickname: res.data[0].nickName,
            pnoneNumber:res.data[0].pnoneNumber
          })
          console.log("已注册，可以发布", res);
        }
      })
      .catch(err =>{
        console.log(err);
      })
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("111")
    App.getopenid(res => {
      console.log("write cb res", res)
      this.setData({
        _openid: res
      })
      this.register(res)
      console.log("openid1",res)
    })  
    this.Type()
  },
  Type(){
    var that=this
    db.collection("categoryDetail").get({
      success(res) {
        console.log("数据库获取成功", res.data[0].Detail[4])
        that.setData({
          // GoodsType: res.data[0].Detail,
          jobType: res.data[1].Detail,
          ptjobConditions: res.data[4].Category
        })
        console.log("GoodsType",that.data.GoodsType)
        console.log("GoodsConditions",that.data.GoodsConditions)
        
      },
      fail(res) {
        console.log("数据库获取失败", res);
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  //导航栏的响应事件
  choosePostGoods: function(e) {
    var that = this;
    that.setData({
      postGoods: true,
      postJob: false,
      postErrand: false
    })
  },
  choosePostJob: function(e) {
    var that = this;
    that.setData({
      postGoods: false,
      postJob: true,
      postErrand: false
    })
  },
  choosePostErrand: function(e) {
    var that = this;
    that.setData({
      postGoods: false,
      postJob: false,
      postErrand: true
    })
   
  },
  //响应事件

  bindJobNameInput: function(e) { //兼职名称
    console.log(e)
    this.setData({
      jobName: e.detail.value
    })
  },
  bindJobTimeInput: function(e) { //兼职时间
    console.log(e)
    this.setData({
      jobTime: e.detail.value
    })
  },
  bindJobPlaceInput: function(e) { //兼职地点
    console.log(e)
    this.setData({
      jobPlace: e.detail.value
    })
  },
  bindJobRequirInput: function(e) { //兼职要求
    console.log(e)
    this.setData({
      jobRequir: e.detail.value
    })
  },
  bindjobSalaryInput: function(e) { //兼职工资
    console.log(e)
    this.setData({
      jobSalary: e.detail.value
    })
  },
  bindJobWayInput: function(e) { //兼职联系方式
    console.log(e)
    this.setData({
      jobWay: e.detail.value
    })
  },
  bindJobDescribeInput: function(e) { //兼职描述
    console.log(e)
    this.setData({
      jobDescribe: e.detail.value
    })
  },
  bindjobTypeChange: function(e) { //兼职类型
    console.log(e)
    this.setData({
      jobTypeIndex: e.detail.value
    })
  },

//跑腿
bindjobNameInput: function(e) { //跑腿需求
  this.setData({
    ptjobName: e.detail.value
  })
},
catagoryInput:function (e) {  //跑腿类型
  this.setData({
    ptjobConditionIndex:e.detail.value,
  })
  if(this.data.ptjobConditionIndex == 0){
    this.setData({
      ptplaceSelect:["令德餐厅","文赢餐厅","文化餐厅"],
      ptplaceSelectIndex:0
    })
  }
  else if(this.data.ptjobConditionIndex == 1){
    this.setData({
      ptplaceSelect:["烘培屋","好利来","大熊烘培"],
      ptplaceSelectIndex:0
    })
  }
  else if(this.data.ptjobConditionIndex == 4){
    this.setData({
      ptplaceSelect:["中通快递","文赢菜鸟驿站","令德菜鸟驿站"],
      ptplaceSelectIndex:0
    })
  }else{
    this.setData({
      ptplaceSelect:["全校"],
      ptplaceSelectIndex:0
    })
  }
  
  
},
selectInput:function (e) {    //商户选择
  this.setData({
    ptplaceSelect:e.detail.value
  })
  
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
selectInput:function (e) {    //商户选择
 
  this.setData({
    ptplaceSelectIndex:e.detail.value
  })
  
},
bindjobserveInput:function (e) {    //跑腿费用
  var money;
  if (/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value)) { //正则验证，金额小数点后不能大于两位数字
    money = e.detail.value;
  } else {
    money = e.detail.value.substring(0, e.detail.value.length - 1);
  }
  console.log(money)
  this.setData({
    ptservePrice:money
  })

  
},
schoolInput:function (e) {    //校区

  this.setData({
    ptjobCampusIndex: e.detail.value
  })
  
},
bindjobPhoneNumberInput: function(e) { //联系方式
  this.setData({
    ptjobPhoneNumber: e.detail.value,
  })
},
bindjobTime: function(e) { // 送达时间时间
  this.setData({
    ptjobTime: e.detail.value
  })
},
bindjobPlace: function(e) { //送达地址地点
  this.setData({
    ptjobPlace: e.detail.value
  })
},
bindjobDescribeInput: function(e) { //备注信息
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
        if (that.data.imgList != null) {
          len = that.data.imgList.length
        }   //获取当前已有的图片
        wx.chooseImage({
          count: 9 - len,     //最多还能上传的图片数,这里最多可以上传5张
          sizeType: ['original', 'compressed'],        //可以指定是原图还是压缩图,默认二者都有
          sourceType: [type],             //可以指定来源是相册还是相机, 默认二者都有
          success: function (res) {
            wx.showToast({
              title: '正在检测图片',
              icon: "loading",
              mask: true,
              duration: 1000
            })
            // 返回选定照片的本地文件路径列表,tempFilePaths可以作为img标签的scr属性显示图片
            var imgList = res.tempFilePaths
             console.log("imgList",imgList)
             imgList.forEach(items => {
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
                      let tempFilePathsImg = that.data.imgList
                      // 获取当前已上传的图片的数组
                      console.log('内容OK之后',items)
                      var tempFilePathsImgs = tempFilePathsImg.concat(items)
                      that.setData({
                        imgList: tempFilePathsImgs
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
            
          },
          fail: function () {
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
        let index = e.target.dataset.index;
        let that = this;
        wx.previewImage({
          current: that.data.imgList[index],
          urls: that.data.imgList
        })
      },
      /**
       * 点击删除图片  物品
       */
      deleteImg: function (e) {
        var that = this;
        var imgList = that.data.imgList;
        var index = e.currentTarget.dataset.index;  
        console.log('index',index)    //获取当前点击图片下标
        wx.showModal({
          title: '提示',
          content: '确认要删除该图片吗?',
          success: function (res) {
            if (res.confirm) {
              console.log("点击确定了")
              imgList.splice(index, 1);
            } else if (res.cancel) {
              console.log("点击取消了");
              return false
            }
            that.setData({
              imgList
            })
          }
        })
      },


  // 书本发布上传视频
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
              src: res.tempFilePath,
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
              src:''
            })
          } else if (res.cancel) {
            console.log("点击取消了");
            return false
          }
        }
      })
    },

  //物品发布按钮
  bindSubmitGoods: function() {
    var that = this;
    if(that.data.GoodsName == ''||  that.data.GoodsPrice==''||that.data.GoodsWay == ''){
      wx.showToast({
        title: '您还有信息未填',
        icon: 'none',
        duration: 1500
      })
      return;
    }else{
      wx.requestSubscribeMessage({
        tmplIds: ['OgmNzl3p7y3sWo7_9ONL_pXSNG6ZoVhRmKaUTskSwcs','SldzZqnw3SHSEM3zADp0h_Fc6SO09qFFGaCSqJ15_Ms'], 
        success(res) {
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
                that._ifUploadGoods()
            } else {
              wx.showToast({
                title: '包含敏感字，禁止发布',
                icon: 'none',
                duration: 3000
              })
            }
          })
        },
        fail(res) {
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
            that._ifUploadGoods()
        } else {
          wx.showToast({
            title: '包含敏感字，禁止发布',
            icon: 'none',
            duration: 3000
          })
        }
      })
        }
      })
      
     /*  var msgSC=that.data.GoodsName+that.data.GoodsWay+that.data.GoodsRemark 
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
            that._ifUploadGoods()
        } else {
          wx.showToast({
            title: '包含敏感字，禁止发布',
            icon: 'none',
            duration: 3000
          })
        }
      }) */
    }
  },
  //上传书本图片视频到数据库以及上传
      _ifUploadGoods: function () {
        var that = this;
        var GoodsName = that.data.GoodsName;
        var GoodsTypeIndex = Number(that.data.GoodsTypeIndex);
        var GoodsType = that.data.GoodsType[GoodsTypeIndex];
        var GoodsConditionsIndex = Number(that.data.GoodsConditionsIndex);
        var GoodsConditions = that.data.GoodsConditions[GoodsConditionsIndex];
        var GoodsCampusIndex = Number(that.data.GoodsCampusIndex);
        var GoodsCampus = that.data.GoodsCampus[GoodsCampusIndex];
        var GoodsPrice= Number(that.data.GoodsPrice);
        var GoodsWay= that.data.GoodsWay;
        var GoodsRemark = that.data.GoodsRemark 
        || '无备注或描述';
        var nickName = that.data.nickname;
        var phoneNumber = that.data.phoneNumber;
        var imgList1=that.data.imgList;
        var src1=that.data.src;
        var GoodsNum = 1;
        console.log('src1',src1)
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
              that.addGoods(GoodsName,GoodsTypeIndex,GoodsType,GoodsConditionsIndex,GoodsConditions,GoodsCampusIndex,GoodsCampus,GoodsPrice,GoodsWay,GoodsRemark,nickName,phoneNumber,imgList1,src1,GoodsNum)
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
                  that.addGoods(GoodsName,GoodsTypeIndex,GoodsType,GoodsConditionsIndex,GoodsConditions,GoodsCampusIndex,GoodsCampus,GoodsPrice,GoodsWay,GoodsRemark,nickName,phoneNumber,imgList1,that.data.srcPath,GoodsNum)
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
              that.addGoods(GoodsName,GoodsTypeIndex,GoodsType,GoodsConditionsIndex,GoodsConditions,GoodsCampusIndex,GoodsCampus,GoodsPrice,GoodsWay,GoodsRemark,nickName,phoneNumber,that.data.imagePathArray,src1,GoodsNum)
              
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
                  that.addGoods(GoodsName,GoodsTypeIndex,GoodsType,GoodsConditionsIndex,GoodsConditions,GoodsCampusIndex,GoodsCampus,GoodsPrice,GoodsWay,GoodsRemark,nickName,phoneNumber,that.data.imagePathArray,that.data.srcPath,GoodsNum)
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
  // 添加物品信息到数据库
  addGoods(GoodsName,GoodsTypeIndex,GoodsType,GoodsConditionsIndex,GoodsConditions,GoodsCampusIndex,GoodsCampus,GoodsPrice,GoodsWay,GoodsRemark,nickName,phoneNumber,imagePathArray,srcPath,GoodsNum){
    var that=this
    db.collection('wxGoodsPost').add({
      data: {
        GoodsName:GoodsName,
        GoodsTypeIndex:GoodsTypeIndex,
        GoodsType:GoodsType,
        GoodsConditionsIndex:GoodsConditionsIndex,
        GoodsConditions:GoodsConditions,
        GoodsCampusIndex:GoodsCampusIndex,
        GoodsCampus:GoodsCampus,
        GoodsPrice:GoodsPrice,
        GoodsWay:GoodsWay,
        GoodsRemark:GoodsRemark,
        nickName:nickName,
        phoneNumber:phoneNumber,
        imgArr:imagePathArray, //图片
        videoArr:srcPath, //视频
        status:"未售",
        isStatus:false,
        isRecommend:false,
        isviolation:false,
        time:formatDate2(new Date().getTime()),
        Time:new Date().getTime(),
        GoodsNum:GoodsNum
      },
      success: res => {
        console.log("添加数据库成功", res)
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
          icon: 'succes',
          duration: 2500,
          mask: true
        }) 
        that.setData({
          postGoods: true,
          postJob: false,
          postErrand: false,
          //物品发布的数据
          GoodsWay: '', //用户联系方式
          GoodsName: '', //  物品名字 
          GoodsType:[],
          GoodsTypeIndex:0,
          GoodsConditions: ["全新", "几乎全新", "九成新", "八成新", "七成新", "六成新", "五成新", "五成新以下"], //成色
          GoodsConditionsIndex: 2, 
          GoodsCampus: ["大东关校区", "坞城校区","东山校区"], //校区
          GoodsCampusIndex: 0,
          GoodsPrice:'', //物品价格
          GoodsRemark: '', // 备注8
          imgList:[],
          src: "",
          srcPath:"",
          imagePathArray: [],
        },()=>{
          wx.navigateTo({
            url: '/pages/my/myPost/myPost?goCurrtab='+Number(0),
          }) 
        })
        
      },
      fail: err => {
        console.log("添加数据库失败", err)
        wx.showToast({
          title: '发布失败',
          icon: 'loading',
          duration: 2000
        })
        wx.switchTab({
          url: '/pages/post/post',
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
    //上传物兼职
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
      var jobTypeIndex = Number(that.data.jobTypeIndex);
      var jobType = that.data.jobType[jobTypeIndex];
      console.log("名字",nickName1)
      wx.showToast({
          title: '上传中',
          icon: 'succes',
          duration: 2500,
          mask: true
      })
      that.addJob(jobName,jobDescribe,jobWay,jobSalary,jobPlace,jobTime,jobRequir,nickName1,jobTypeIndex,jobType) 
    },
    // 添加兼职信息到数据库
    addJob(jobName,jobDescribe,jobWay,jobSalary,jobPlace,jobTime,jobRequir,nickName1,jobTypeIndex,jobType){
      var that=this
    db.collection('wxjobpost').add({
    data: {
      jobName: jobName,
      jobRequir: jobRequir,
      jobTime: jobTime,
      jobDescribe: jobDescribe,
      jobWay: jobWay,
      jobSalary: jobSalary,
      jobPlace: jobPlace,
      time:formatDate2(new Date().getTime()),
      nickname:nickName1,
      status:"未售",
      isStatus:false,
      isviolation:false,
      Time:new Date().getTime(),
      jobTypeIndex:jobTypeIndex,
      jobType:jobType
    },
    success: res => {
      console.log("添加数据库成功了", res)
      wx.showToast({
        title: '发布成功',
        icon: 'succes',
        duration: 2500,
        mask: true
      }) 
      that.setData({
        postGoods: false,
        postJob: true,
        postErrand: false,
        jobName: '',
        jobType:[],
        jobTypeIndex:0,
        jobTime: '',
        jobPlace: '',
        jobRequir: '',
        jobSalary: '',
        jobWay: '',
        jobDescribe: '',
      },()=>{
        wx.navigateTo({
          url:  '/pages/my/myPost/myPost?goCurrtab='+Number(2),
        }) 
      })
     
    },
    fail: err => {
      console.log("添加数据库失败", err)
      wx.showToast({
        title: '发布失败',
        icon: 'loading',
        duration: 2000
      })
      wx.switchTab({
        url: '/pages/post/post',
      })
    }
    })
    },

    //发布跑腿的响应事件
  bindSubmitptJob: function() {
    var that = this;
    console.log('openid',that.data._openid)
    if(that.data.ptjobName == ''||that.data.ptjobPhoneNumber ==''|| that.data.ptjobPlace == ''|| that.data.ptjobTime ==''){
      wx.showToast({
        title: '您还有信息未填',
        icon: 'none',
        duration: 1500
      })
      return;
    }else{
      that.shouquan();
    } 
  },
  shouquan(){  //跑腿服务订阅消息授权
    var that = this;
    wx.requestSubscribeMessage({
      tmplIds: ['566eDzNUCCJr6Tb6ioOAtTYhI1Qz-Jo6lTx_Y3Z4Sg4'],
      success(res){
        console.log('授权成功',res)
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
            that._ifUploadptJob();
          
          } else {
            wx.showToast({
              title: '包含敏感字，禁止发布',
              icon: 'none',
              duration: 3000
            })
          }
        })
      },
      fail(res){
        console.log('授权成功',res)
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
            that._ifUploadptJob();
          
          } else {
            wx.showToast({
              title: '包含敏感字，禁止发布',
              icon: 'none',
              duration: 3000
            })
          }
        })
        console.log('授权失败',res);
      }
    })



  },
  //上传跑腿
  _ifUploadptJob: function () {  
    var that = this;
    var ptType = that.data.ptjobConditions[ptjobConditionIndex];
    console.log('ptType',ptType)
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
    var nickName1 = that.data.nickname; 
    if(ptjobCampusIndex == 0){
      var ptjobConditionIndex = Number(that.data.ptjobConditionIndex) + 3;
    }
    else if(ptjobCampusIndex == 1){
      var ptjobConditionIndex = Number(that.data.ptjobConditionIndex) + 1;

    }else{
      var ptjobConditionIndex = Number(that.data.ptjobConditionIndex) + 3;

    }

    wx.showToast({
        title: '上传中',
        icon: 'succes',
        duration: 2500,
        mask: true
    })
    that.addptJob(ptjobName,ptservePrice,ptjobDescribe,ptjobCampusIndex,ptjobCampus,ptjobPhoneNumber,ptType,ptjobPlace,ptjobTime,ptjobPrice,nickName1,ptplaceSelect,ptjobConditionIndex,ptplaceSelectIndex) 
  },
  // 添加兼职信息到数据库
  addptJob(ptjobName,ptservePrice,ptjobDescribe,ptjobCampusIndex,ptjobCampus,ptjobPhoneNumber,ptType,ptjobPlace,ptjobTime,ptjobPrice,nickName1,ptplaceSelect,ptjobConditionIndex,ptplaceSelectIndex){
  var that=this
  db.collection('paotuiDatas').add({
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
    nickname:nickName1,
    ptplaceSelect:ptplaceSelect,
    ptjobConditionIndex:ptjobConditionIndex,
    ptplaceSelectIndex:ptplaceSelectIndex,
    time:formatDate2(new Date().getTime()),
    status:"未接单",
    isStatus:false,
    isviolation:false,
    Time:new Date().getTime(),
    sureOrder:false,
    sureOrderstatus:'确定收货',
    isptjob:true
  },
  success: res => {
    console.log("添加数据库成功跑腿", res)
    wx.showToast({
      title: '发布成功',
      icon: 'succes',
      duration: 2500,
      mask: true
    }) 
    that.setData({
      postGoods: false,
      postJob:false,
      postErrand: true,
      ptjobConditions: [],
      ptjobCampus: ["大东关校区", "坞城校区","东山校区"], //6
      ptplaceSelect:["令德餐厅","文赢餐厅","文化餐厅"],
      ptplaceSelectIndex:0,
      ptjobCampusIndex: 0,
      ptjobConditionIndex: 0,
      ptjobName: '',
      ptservePrice:'',
      ptjobTime: '',
      ptjobPhoneNumber:'',
      ptjobPlace: '',
      ptjobPrice:'',
      ptjobRequir: '',
      ptjobSalary: '',
      ptjobWay: '',
      ptpostJobName:"",
      ptjobDescribe: '',
      // buttonLoadingJob: false,
    },()=>{
      wx.navigateTo({
        url:  '/pages/my/myPost/myPost?goCurrtab='+Number(1),
      }) 
    })
  },
  fail: err => {
    console.log("添加数据库失败", err)
    wx.showToast({
      title: '发布失败',
      icon: 'loading',
      duration: 2000
    })
    wx.switchTab({
      url: '/pages/post/post',
    })
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