// app.js
import request from '/utils/request.js';
App({
  onLaunch() {
    let token = wx.getStorageSync('token');
    if(token === null || token === '' || token === undefined){
      this.login();
    }
  },
  login() {
    let that = this;
    wx.login({
      success:(res)=>{
        that.globalData.code = res.code
        wx.getUserInfo({
          success: function(res) {
            request.postData(
              "/api/v1/wechat/login",
              {
                "code": getApp().globalData.code,
                "rawData": res.rawData,
                "signature": res.signature,
                "encryptedData": res.encryptedData,
                "iv": res.iv          
              }
            ).then(res => {
              wx.setStorageSync('token', res.data);
            });
          }
        })
      },
    })
  },
  globalData: {
    code: ''
  }
})
