const prodUrl = 'https://www.cherry-coast.com:8787'
const testUrl = 'https://127.0.0.1:8787'
const baseUrl = prodUrl

var app = getApp()

// get request
const postData = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + url,
      data: data,
      method: 'POST',
      header: getHeader(url),
      success: function(res) {
        if (res.data.code !== 200) {
          reject(res);
        } else {
          resolve(res.data);
        }
      },
      fail: function(res) {
        reject(res);
      },
      complete: function() {
        console.log("interface request " + url + " complete \u{1F680} \u{1F680} \u{1F680} \u{1F680});")
      }
    })
  });
}
// get request
const getData = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + url,
      data: data,
      method: 'GET',
      header: getHeader(url),
      success: function(res) {
        if (res.data.code !== 200) {
          reject(res);
        } else {
          resolve(res.data);
        }
      },
      fail: function(res) {
        reject(res);
      },
      complete: function() {
        console.log("interface request " + url + " complete \u{1F680} \u{1F680} \u{1F680} \u{1F680});")
      }
    })
  });
}

const getHeader = url => {
  let header = {}
  if(url === '/api/v1/wechat/login') {
    header = {
      "Content-Type": "application/json"
    }
  } else {
    header = {
      "Content-Type": "application/json",
      "token": wx.getStorageSync('token')
    }
  }
  return header;
}

const errorProcess = res => {
  if(res.statusCode === 401) {
    wx.showToast({
      title: '登录失效，请刷新小程序重新进入~',
      duration: 2000,
      icon: 'none',
      mask: true 
    })
  } else {
    wx.showToast({
      title: '小程序获取你的奖品失败，请检查配置~', //提示的内容
      duration: 1000, //持续的时间
      icon: 'none', //图标有success、error、loading、none四种
      mask: true //显示透明蒙层 防止触摸穿透
    })
  }
}

module.exports = {
  postData,
  getData,
  getHeader,
  errorProcess
}