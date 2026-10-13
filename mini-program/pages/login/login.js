Page({
    data: {
      userTypes: ['家长', '辅导员', '学生'],
      userTypeIndex: 0
    },
  
    onShow() {
      // 登录状态检查
      const app = getApp();
      if (app.globalData.userType === 'student') {
        wx.reLaunch({
          url: '/pages/advice/advice'
        });
      } else if (app.globalData.userType === 'parent' || app.globalData.userType === 'counselor') {
        wx.reLaunch({
          url: '/pages/index/index'
        });
      }
    },
  
    bindUserTypeChange(e) {
      this.setData({ userTypeIndex: e.detail.value });
    },
  
    onGetUserInfo(e) {
      const app = getApp();
      const userTypes = ['parent', 'counselor', 'student'];
      
      // 保存用户类型
      const userType = userTypes[this.data.userTypeIndex];
      wx.setStorageSync('userType', userType);
      app.globalData.userType = userType;
      
      // 保存用户名
      if (e.detail.userInfo) {
        wx.setStorageSync('userName', e.detail.userInfo.nickName);
      }
      
      // 学生身份进入心理建议页面（无导航）
      if (userType === 'student') {
        wx.reLaunch({
          url: '/pages/advice/advice'
        });
      } 
      // 辅导员/家长进入首页
      else {
        wx.reLaunch({
          url: '/pages/index/index'
        });
      }
    }
  });