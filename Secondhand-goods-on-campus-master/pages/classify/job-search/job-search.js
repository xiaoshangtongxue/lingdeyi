let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recentSearchJob: [],
    JobsearchValue: '',
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
    this. recentSearchJob();
  },

  /**
   * 获取历史搜索
   */
  recentSearchJob() {
    let recentSearchJob= wx.getStorageSync('recentSearchJob');
    this.setData({ recentSearchJob });
    console.log("recentSearchJob",recentSearchJob)
  },

 

 /**
   * 绑定输入值
   */
  getSearchContentJob(e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      keyWord: value
    })
  },

    /**
   * 搜索提交
   */
  searchJob(e) {
    var that = this;
    var keyWord = that.data.keyWord;
    that.data.JobsearchValue = keyWord;
    // 记录最近搜索
    if (that.data.JobsearchValue) {
      let recentSearchJob= wx.getStorageSync('recentSearchJob') || [];
      console.log('success:'+that.data.JobsearchValue);
      recentSearchJob.unshift(that.data.JobsearchValue);
      wx.setStorageSync('recentSearchJob', recentSearchJob)
      console.log('keyWord',keyWord);
      wx.navigateTo({
        url: '/pages/classify/job-searchResult/job-searchResult?keyWord=' + keyWord
      })
    }
},

  /**
   * 清空最近搜索记录
   */
  clearSearchJob() {
    wx.removeStorageSync('recentSearchJob');
    this.getRecentSearchJob();
  },

  /**
   * 跳转到最近搜索
   */
  goSearchJob(e) {
    wx.navigateTo({  
      url: '/pages/classify/job-searchResult/job-searchResult?keyWord=' + e.target.dataset.text,
    })
    console.log('text',e.target.dataset.text);
  },

})