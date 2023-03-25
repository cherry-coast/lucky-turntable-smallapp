var app = getApp()
var request = require('../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRevolve: false,
    opoUpShow:false,
    winsShow:false,
    awardIndex:0,
    list: [],
    statusBarHeight: getApp().globalData.statusBarHeight,
    scrollHeight: 200,
    windowWidth:0,
    windowHeight:0,
    size: 600,
    awardsConfig: {
      slicePrizes: [],
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    if(wx.getStorageSync('token') === null || wx.getStorageSync('token') === '' || wx.getStorageSync('token') == undefined) {
      wx.showToast({
        title: '加载奖品中~', //提示的内容
        duration: 2000, //持续的时间
        icon: 'loading', //图标有success、error、loading、none四种
        mask: true //显示透明蒙层 防止触摸穿透
      })
      setTimeout(() => {
        that.getPrize();
      }, 2000)
    } else {
      that.getPrize();
    }
    
    
  },
  getPrize: function() {
    var that = this;
    request.getData("/api/v1/prize/getPrize")
    .then(res => {
      that.setData({
        awardsConfig :  {'slicePrizes' : res.data}
      })
    }).then(data => {
      // 绘制页面
      that.initAdards()
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            windowWidth: res.windowWidth,
            windowHeight: res.windowHeight,
            scrollHeight: res.windowHeight - res.windowWidth / 750 * (getApp().globalData.statusBarHeight * 2 + 98)
          });
        },
      })
    }).catch(err => {
      if(err.statusCode === 401) {
        let page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad(page.options)
        app.login();
      }
    });
  },
  onShow: function() {
  },
  onReady: function(e) {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          contentHeight: res.windowHeight
        });
      },
    })
    let list = that.data.awardsConfig.slicePrizes
    //外框灯 奖品 * 2
    that.setData({
      list: list.concat(list)
    });
  },
  //初始化奖品数据 计算角度
  initAdards() {
    let that = this,
    awardsConfig = that.data.awardsConfig;
    let t = awardsConfig.slicePrizes.length; // 选项长度
    let e = 1 / t,
      i = 360 / t,
      r = i - 90;

    for (var g = 0; g < t; g++) {
      //当前下标 * 360/长度 + 90 - 360/长度/2
      awardsConfig.slicePrizes[g].item2Deg = g * i + 90 - i / 2 + "deg";
      awardsConfig.slicePrizes[g].afterDeg = r + "deg";
      awardsConfig.slicePrizes[g].opacity = '1';
    }
    that.setData({
      // 页面的单位是turn
      turnNum: e, 
      awardsConfig: awardsConfig,
    })
  },
  /**
  * 抽奖处理函数：
  */
  getLottery: function () {
    if(!this.data.isRevolve) {
      let that = this;
      that.setData({
        isRevolve: true
      })
      // 获取奖品配置
      let awardsConfig = that.data.awardsConfig, runNum = 10, len = awardsConfig.slicePrizes.length, awardIndex = 0;

      // 请求抽奖接口
      request.getData("/api/v1/prize/lottery").then(res => {
        awardIndex = res.data
        // 旋转抽奖
        app.runDegs = app.runDegs || 0
        app.runDegs = app.runDegs + (360 - app.runDegs % 360) + (360 * runNum - awardIndex * (360 / len))
        //创建动画
        let animationRun = wx.createAnimation({
          duration: 4000,
          timingFunction: 'ease'
        })
        that.animationRun = animationRun
        animationRun.rotate(app.runDegs).step()
        that.setData({
          awardIndex: awardIndex,
          animationData: animationRun.export()
        })
      }).catch(err => {
        request.errorProcess(err)
      })
    }
  },
  animationend(){
    let awardsConfig = this.data.awardsConfig, awardIndex = this.data.awardIndex
    wx.showToast({
      title: '今日吃' + awardsConfig.slicePrizes[awardIndex].prizeName,
    })
    
    this.setData({
      isRevolve: false
    })
  },
  




  // recurChange(){
  //   this.setData({
  //     winsShow:false,
  //     opoUpShow:false
  //   })
  // },
  // blurInput (e) {
  //   this.setData({
  //     addValue: e.detail.value
  //   })
  // },
  // addChange (e) {
  //   console.log(e)
  //   let addValue = this.data.addValue,
  //   awardsConfig = this.data.awardsConfig,
  //   arr = []
  //   if(addValue){
  //     arr.push({ text: addValue, img: "https://gw.alicdn.com/imgextra/i3/2213973450744/O1CN01dRGzDj1HMnUfZFMYD_!!2213973450744-0-alimamacc.jpg_300x300q90.jpg", title: "x1", num: "100", x: "1" })
  //     awardsConfig.slicePrizes.map(res=>{
  //       if(arr.length<awardsConfig.slicePrizes.length) {
  //         arr.push(res)
  //       }
  //     })
  //     awardsConfig.slicePrizes = arr
  //     this.setData({
  //       awardsConfig: awardsConfig,
  //       addValue: ''
  //     })
  //     this.initAdards()
  //   } else {
  //     wx.showToast({
  //       title: '想吃什麽呢~~？？？',
  //       icon: 'none'
  //     })
  //   }
  // }
})