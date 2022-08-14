let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recentSearchGoods: [],
    GoodssearchValue: '',
    keyWord:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 获取历史搜索
    this. recentSearchGoods();
  },

  /**
   * 获取历史搜索
   */
  recentSearchGoods() {
    let recentSearchGoods= wx.getStorageSync('recentSearchGoods');
    this.setData({ recentSearchGoods });
  },

 

 /**
   * 绑定输入值
   */
  getSearchContentGoods(e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      keyWord: value
    })
  },

    /**
   * 搜索提交
   */
  searchGoods(e) {
    var that = this;
    var keyWord = that.data.keyWord;
    that.data.GoodssearchValue = keyWord;
    // 记录最近搜索
    if (that.data.GoodssearchValue) {
      let recentSearchGoods= wx.getStorageSync('recentSearchGoods') || [];
      console.log('success:'+that.data.GoodssearchValue);
      recentSearchGoods.unshift(that.data.GoodssearchValue);
      wx.setStorageSync('recentSearchGoods', recentSearchGoods)
      console.log('keyWord',keyWord);
      wx.navigateTo({
        url: '/pages/classify/Goods-searchResult/Goods-searchResult?keyWord=' + keyWord
      })
    }
},

  /**
   * 清空最近搜索记录
   */
  clearSearchGoods() {
    wx.removeStorageSync('recentSearchGoods');
    this.recentSearchGoods();
  },

  /**
   * 跳转到最近搜索
   */
  goSearchGoods(e) {
    wx.navigateTo({  
      url: '/pages/classify/Goods-searchResult/Goods-searchResult?keyWord=' + e.target.dataset.text,
    })
    console.log('text',e.target.dataset.text);
  },

})