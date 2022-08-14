const db = wx.cloud.database()
const App = getApp()
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'

Page({
      /**
       * 生命周期函数--监听页面加载
       */
    data: {
        message:{},
        Takefood:false,
        orderid:'',
        sellopenid:'',
        openid:'',
        // canIUseGetUserProfile: false,
      },
      onLoad: function (options) {
        var that = this;
         console.log('************',options);
         db.collection('FoodOrderInfo').doc(options.scene).get().then(res => {
              console.log('*****',res);
              this.setData({
                message:res.data,
                Takefood:res.data.Takefood,
                orderid:options.scene,
                sellopenid:res.data.sellopenid
                // sellopenid:'123456'
            })
     
           
          })
          App.getopenid(res => {
            console.log("write cb res", res)
            that.setData({
              openid: res
            })
        })
        if(that.data.openid !== that.data.sellopenid){
            Dialog.alert({
                title: '对不起',
                message: '您不是餐厅人员或者请出示正确的二维码!!!',
              }).then(() => {
                wx.reLaunch({
                    url: '/pages/my/my',
                  })
              });
        }
  
      },

    Takefood(){

        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定对方已取餐？',
            success (res) {
       
              if (res.confirm) {
                console.log('用户点击确定')
                wx.cloud.callFunction({
                    // 云函数名称
                  name: 'shouhuo3',
                        // 传给云函数的参数
                  data: {
                    id:that.data.orderid,
                    status:'已完成',
                    isstatus:true,
                    Takefood:true,
                  },
              success: function (res) {

                console.log('修改成功',res);
                   that.setData({
                       Takefood:true
                   })
        
                }
        
              })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
    }
    //   /**
    //    * 获取小程序二维码参数
    //    * @param {String} scene 需要转换的参数字符串
    //    */
    //   getScene: function (scene = "") {
    //     if (scene == "") return {}
    //     let res = {}
    //     let params = decodeURIComponent(scene).split("&")
    //     params.forEach(item => {
    //       let pram = item.split("=")
    //       res[pram[0]] = pram[1]
    //     })
    //     return res
    //   }
    })