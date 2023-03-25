// pages/list/list.js
var request = require('../../utils/request.js');

var app = getApp()
Page({
  data: {
    prizeList: [],
    page: 1,
    size: 10,
    total: 0
  },
  onLoad: function (options) {
  },
  onShow: function () {
    this.getData();
  },
  getData: function(page) {
    let that = this
    request.getData(
      "/api/v1/win/history/getHistory", 
      {
        'pageNo': that.data.page,
        'pageSize': that.data.size
      }).then(res => {
        that.setData({
          prizeList: [...that.data.prizeList, ...res.data.data],
          total: res.data.total
        })
    }).catch(err => {
      request.errorProcess(err)
    });
  },
  onReachBottom() {
    if(this.data.page * this.data.size > this.data.total) {
      wx.showToast({
        title: '没有更多奖品数据了~', //提示的内容
        duration: 1000, //持续的时间
        icon: 'none', //图标有success、error、loading、none四种
        mask: true //显示透明蒙层 防止触摸穿透
     })
    } else {
      this.data.page += 1
      wx.showLoading({
        title: '数据加载中~',
      })
      this.getData(this.data.page);
      wx.hideLoading()
    }
  }
})