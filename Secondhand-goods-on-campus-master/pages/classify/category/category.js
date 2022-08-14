// // pages/index/category.js
// import {
//   getSellersByCategory
// } from '../../utils/apis'
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: true,  //是否显示面板指示点
    autoplay: true,      //是否自动切换
    interval: 3000,       //自动切换时间间隔
    duration: 1000,       //滑动动画时长
    inputShowed: false,
    inputVal: "",
    page: 0,
    orderType: '',
    school:'全部校区',
    hasMore: true,
    loading: false,
    product:[],
    category_id:"",
    info:false,  //用于判读是否各个跑腿订单为空
    arrlist:[]   
  },

 
 /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('找到产品id',options.id)
    let _this = this;
    _this.setData({
      category_id:options.id
    })
    _this.setData({ options }, function () {
      // 获取商品列表
      _this.getProductList(true);
    });

  },
  

    //校区下拉选择
bindShowMsg() {
      this.setData({
          select:!this.data.select,
      
          product:[]
      })
    
  },
  mySelect(e) {
    var _this = this;
    var name = e.currentTarget.dataset.name

   console.log(name)
    this.setData({
        school: name,
        select: false
    })
    _this.data.product = [];
    var booklist = [];
    wx.cloud.database().collection("paotuiDatas").orderBy('Time','desc').where({
      jobConditionIndex:parseInt(this.data.category_id)
    }).get({
      success(res) { 
        console.log('--------------')
        console.log('res',res.data)
        switch(_this.data.school){
          case '全部校区':
            booklist = res.data;
            _this.setData({
              product:booklist
            });
            if(booklist.length === 0){
              _this.setData({
                info:true,
              })
            }
            break;
            case '大东关校区':
              res.data.forEach(item =>{
                if(item.jobCampus === '大东关校区'){
                  booklist.push(item);
                }              
              })
              if(booklist.length === 0){
                _this.setData({
                  info:true,
                })
              }
       
              _this.setData({
                product:booklist,
                arrlist:booklist
              });
                 
              break;
            case '坞城校区':
              res.data.forEach(item =>{
                if(item.jobCampus === '坞城校区'){
                  booklist.push(item);
                
                } 
              })
              if(booklist.length === 0){
                _this.setData({
                  info:true,
                })
              }  
               _this.setData({
                product:booklist,
                arrlist:booklist
              });
              break;
            case '东山校区':
              res.data.forEach(item =>{
                if(item.jobCampus === '东山校区'){  
                  booklist.push(item);
           
                } 
              })
              if(booklist.length === 0){
                _this.setData({
                  info:true,
                })
              }
             
               _this.setData({
                product:booklist,
                arrlist:booklist
              });
              break;
       
              }
       }})
  
  },
 

  getProductList: function (is_super, pageNumber) {
    var booklist = []
    let that = this
    var orderType = that.data.orderType;
    db.collection('swiper').get({             //轮播图
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
  console.log('that.data.category_id',that.data.category_id)
    db.collection('paotuiDatas').orderBy('Time','desc').where({
      jobConditionIndex : parseInt(that.data.category_id),
    }).get({
      success:function(res){
        console.log('获取商品成功',res)
        wx.setStorageSync('product', res.data)
        if(is_super === true && orderType === '' ){   
        that.setData({
          product:res.data
        })
        // wx.setStorageSync("product",that.data.product);
            if(res.data.length === 0){
              that.setData({
                info:true
              })
            }else{
              that.setData({
                info:false
              })
            }
      }
      else if(is_super === true && orderType === 'PRICE_ASC'){   //智能价格排序
  
           that.data.product = [];
           booklist = res.data;
           console.log(orderType)
           console.log(booklist)
           switch(that.data.school){
            case '大东关校区': booklist = that.data.arrlist;                    
            case '坞城校区': booklist = that.data.arrlist;                    
            case '东山校区': booklist = that.data.arrlist;                                     
         }
           var tem;
           for(var i = 0; i < booklist.length - 1; i++){
             for(var j = 0; j < booklist.length - 1 - i; j++ ){
                if(parseInt(booklist[j].servePrice) < parseInt(booklist[j+1].servePrice)){
                    tem = booklist[j];
                    booklist[j] = booklist[j+1];
                    booklist[j+1] = tem;
                }
             }
            
           }
    
        that.setData({
          product:booklist
        })
          }
        else if( is_super === true && orderType === 'PRICE_DESC'){
            that.data.product = [];
            booklist = res.data;
            switch(that.data.school){    
              case '大东关校区': booklist = that.data.arrlist;                    
              case '坞城校区': booklist = that.data.arrlist;                    
              case '东山校区': booklist = that.data.arrlist;                                     
           }
            var tem;
            for(var i = 0; i < booklist.length - 1; i++){
              for(var j = 0; j < booklist.length - 1 - i; j++ ){
                 if(parseInt(booklist[j].servePrice) > parseInt(booklist[j+1].servePrice)){
                     tem = booklist[j];
                     booklist[j] = booklist[j+1];
                     booklist[j+1] = tem;
                 }
              }
             
            }
            that.setData({
              product:booklist
            })
           }
        else if( that.data.orderType === 'TOP_DESC'){
          that.data.product = [];
          booklist = res.data;
          booklist.reverse();
         
          that.setData({
            product:booklist
          })
  
        }
   
      }
    })

  },
  /**
   * 切换排序方式
   */
  switchSortType: function (e) {
    let _this = this
      , orderType
      , newSortType = e.currentTarget.dataset.type
      , newSortPrice = newSortType === 'price' ? !_this.data.sortPrice : true;
    
    if (newSortType === 'price') {
      orderType = newSortPrice ? 'PRICE_ASC' : 'PRICE_DESC';
      
    } else if (newSortType === 'sales') {
      orderType = 'SALES_DESC';
    } else {
      orderType = 'TOP_DESC';
    }

    _this.setData({
      product:[],
      pageNumber: 1,
      sortPrice: newSortPrice,
      orderType: orderType,
      info:false
    },
     function () {
      // 获取商品列表
      _this.getProductList(true);
    }
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var {loading, hasMore} = this.data
    if (hasMore && !loading) {
      this.loadData()
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  loadData() {
    var that = this
    var {id: category_id} = this
    var {loading, page} = this.data
    // console.log('---------------');
    // console.log(id);
    if (loading) {
      return
    }
    that.setData({
      loading: true
    })

    // getSellersByCategory({
    //   category_id, page,
    //   success(data) {
    //     var {list} = that.data
    //     var {
    //       list: list2, count, page
    //     } = data
    //     list2 = list2.map(item => {
    //       item['distanceFormat'] = (item.distance / 1000).toFixed(2)
    //       return item
    //     })
    //     that.setData({
    //       loading: false,
    //       list: list ? list.concat(list2) : list2,
    //       hasMore: count == 10,
    //       page: page + 1
    //     })
    //     wx.setNavigationBarTitle({
    //       title: data.title,
    //     })
    //   }
    // })

  }
})